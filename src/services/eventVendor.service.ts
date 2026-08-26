import sequelize from "@config/database";
import {
  EventVendorSummaryDto,
  SaveEventVendorSelectionsDto,
  VendorBookingResponseDto,
  VendorSearchFilterDto,
  VendorSearchResultDto,
} from "@dto/eventVendor.dto";
import { EventResponseDto } from "@dto/event.dto";
import { EventStatus } from "@models/agent/Event.model";
import clientRepository from "@repositories/client.repository";
import locationRepository from "@repositories/config/location.repository";
import vendorcategoryRepository from "@repositories/config/vendorcategory.repository";
import vendortypeRepository from "@repositories/config/vendortype.repository";
import eventRepository from "@repositories/event.repository";
import eventVendorRepository from "@repositories/eventVendor.repository";
import userRepository from "@repositories/user.repository";
import vendorPricingRepository from "@repositories/vendorPricing.repository";
import vendorProfileRepository from "@repositories/vendorProfile.repository";
import vendorProfileCategoryRepository from "@repositories/vendorProfileCategory.repository";
import vendorProfileLocationRepository from "@repositories/vendorProfileLocation.repository";
import vendorUnavailabilityRepository from "@repositories/vendorUnavailability.repository";
import {
  assertAgentOwnership,
  resolveAgentScope,
} from "@services/helpers/resolveAgentProfileForRequest";
import ApiError from "@utils/ApiError";
import { JWTPayload } from "@utils/helpers";

class EventVendorService {
  searchAvailableVendors = async (
    filters: VendorSearchFilterDto,
  ): Promise<VendorSearchResultDto[]> => {
    const { location_id, date, vendor_type_id, vendor_category_id } = filters;

    const location = await locationRepository.findById(location_id);
    if (!location) {
      throw ApiError.notFound("Location not found");
    }

    let candidates = await vendorProfileRepository.findApproved(vendor_type_id);
    if (!candidates.length) return [];

    const users = await userRepository.findByIds(candidates.map((c) => c.user_id));
    const verifiedUserIds = new Set(users.filter((u) => u.email_verified).map((u) => u.id));
    candidates = candidates.filter((c) => verifiedUserIds.has(c.user_id));
    if (!candidates.length) return [];

    const unavailableRows = await vendorUnavailabilityRepository.findByVendorProfileIdsAndDate(
      candidates.map((c) => c.id),
      date,
    );
    const unavailableIds = new Set(unavailableRows.map((r) => r.vendor_profile_id));
    candidates = candidates.filter((c) => !unavailableIds.has(c.id));
    if (!candidates.length) return [];

    if (vendor_category_id !== undefined) {
      const categoryLinks = await vendorProfileCategoryRepository.findByVendorProfileIds(
        candidates.map((c) => c.id),
      );
      const idsWithCategory = new Set(
        categoryLinks
          .filter((l) => l.vendor_category_id === vendor_category_id)
          .map((l) => l.vendor_profile_id),
      );
      candidates = candidates.filter((c) => idsWithCategory.has(c.id));
    }
    if (!candidates.length) return [];

    const candidateIds = candidates.map((c) => c.id);
    const [locationLinks, categoryLinks, pricingRows] = await Promise.all([
      vendorProfileLocationRepository.findByVendorProfileIds(candidateIds),
      vendorProfileCategoryRepository.findByVendorProfileIds(candidateIds),
      vendorPricingRepository.findByVendorProfileIds(candidateIds),
    ]);

    const matchingLocationVendorIds = new Set(
      locationLinks.filter((l) => l.location_id === location_id).map((l) => l.vendor_profile_id),
    );

    const categoryIds = [...new Set(categoryLinks.map((l) => l.vendor_category_id))];
    const categories = await vendorcategoryRepository.findByIds(categoryIds);
    const categoryById = new Map(categories.map((c) => [c.id, c]));

    const categoryLinksByVendorId = new Map<number, typeof categoryLinks>();
    for (const link of categoryLinks) {
      const list = categoryLinksByVendorId.get(link.vendor_profile_id) ?? [];
      list.push(link);
      categoryLinksByVendorId.set(link.vendor_profile_id, list);
    }

    const pricingByVendorId = new Map<number, typeof pricingRows>();
    for (const pricing of pricingRows) {
      const list = pricingByVendorId.get(pricing.vendor_profile_id) ?? [];
      list.push(pricing);
      pricingByVendorId.set(pricing.vendor_profile_id, list);
    }

    const vendorTypeIds = [
      ...new Set(candidates.map((c) => c.vendor_type_id).filter((id): id is number => id !== null)),
    ];
    const vendorTypes = await vendortypeRepository.findByIds(vendorTypeIds);
    const vendorTypeById = new Map(vendorTypes.map((t) => [t.id, t]));

    const results: VendorSearchResultDto[] = candidates.map((c) => {
      const categoryLinksForVendor = categoryLinksByVendorId.get(c.id) ?? [];
      return {
        vendor_profile_id: c.id,
        business_name: c.business_name,
        description: c.description,
        address: c.address,
        phone_number: c.phone_number,
        email: c.email,
        vendor_type: c.vendor_type_id
          ? { id: c.vendor_type_id, name: vendorTypeById.get(c.vendor_type_id)?.name ?? "" }
          : null,
        vendor_categories: categoryLinksForVendor.map((l) => ({
          id: l.vendor_category_id,
          name: categoryById.get(l.vendor_category_id)?.name ?? "",
        })),
        pricing_details: (pricingByVendorId.get(c.id) ?? []).map((p) => ({
          id: p.id,
          pricing_type: p.pricing_type,
          amount: p.amount,
        })),
        location_match: matchingLocationVendorIds.has(c.id),
      };
    });

    results.sort((a, b) => Number(b.location_match) - Number(a.location_match));
    return results;
  };

  getVendorBookings = async (
    user: JWTPayload,
    statuses?: EventStatus[],
  ): Promise<VendorBookingResponseDto[]> => {
    const vendorProfile = await vendorProfileRepository.findByUserId(user.id);
    if (!vendorProfile) {
      throw ApiError.notFound("Vendor profile not found");
    }

    const eventVendorRows = await eventVendorRepository.findByVendorProfileId(vendorProfile.id);
    if (!eventVendorRows.length) return [];

    const eventVendorByEventId = new Map(eventVendorRows.map((ev) => [ev.event_id, ev]));

    let events = await eventRepository.findByIds(eventVendorRows.map((ev) => ev.event_id));
    if (statuses?.length) {
      const statusSet = new Set(statuses);
      events = events.filter((e) => statusSet.has(e.status));
    }
    if (!events.length) return [];

    const clients = await clientRepository.findByIds([...new Set(events.map((e) => e.client_id))]);
    const clientById = new Map(clients.map((c) => [c.id, c]));

    const locations = await locationRepository.findByIds([
      ...new Set(clients.map((c) => c.location_id)),
    ]);
    const locationById = new Map(locations.map((l) => [l.id, l]));

    return events.map((event) => {
      const client = clientById.get(event.client_id);
      const location = client ? locationById.get(client.location_id) : undefined;
      const eventVendor = eventVendorByEventId.get(event.id)!;
      return {
        client: {
          id: client?.id ?? event.client_id,
          name: client?.name ?? "",
          email: client?.email ?? null,
          phone: client?.phone ?? "",
          address: client?.address ?? "",
          location: { id: client?.location_id ?? 0, name: location?.name ?? "" },
        },
        event: {
          id: event.id,
          event_name: event.event_name,
          event_priority: event.event_priority,
          estimated_budget: event.estimated_budget,
          preferred_date: event.preferred_date,
          additional_notes: event.additional_notes,
          status: event.status,
          total_amount: event.total_amount,
          payment_receipt_url: event.payment_receipt_url,
          confirmed_at: event.confirmed_at,
        },
        my_selection: {
          pricing_type: eventVendor.pricing_type,
          amount: eventVendor.amount,
        },
      };
    });
  };

  saveEventVendorSelections = async (
    user: JWTPayload,
    data: SaveEventVendorSelectionsDto,
  ): Promise<{ event: EventResponseDto; vendors: EventVendorSummaryDto[] }> => {
    const { event_id, selections } = data;
    const scope = await resolveAgentScope(user);
    const event = await eventRepository.findById(event_id);
    if (!event) {
      throw ApiError.notFound("Event not found");
    }
    assertAgentOwnership(scope, event.agent_profile_id);
    if (event.status === EventStatus.CONFIRMED) {
      throw ApiError.badRequest("Cannot change vendors on a confirmed event");
    }

    const vendorProfileIds = selections.map((s) => s.vendor_profile_id);
    const uniqueVendorProfileIds = [...new Set(vendorProfileIds)];
    if (uniqueVendorProfileIds.length !== vendorProfileIds.length) {
      throw ApiError.badRequest("Duplicate vendor selections are not allowed");
    }

    const rowsToCreate: {
      vendor_profile_id: number;
      pricing_type: (typeof selections)[number]["pricing_type"];
      amount: number;
    }[] = [];

    if (selections.length > 0) {
      const vendorProfiles = await vendorProfileRepository.findByIds(uniqueVendorProfileIds);
      if (vendorProfiles.length !== uniqueVendorProfileIds.length) {
        throw ApiError.notFound("Some of the selected vendors were not found");
      }
      if (vendorProfiles.some((v) => !v.profile_completed)) {
        throw ApiError.badRequest("Some of the selected vendors are not approved");
      }

      const vendorUsers = await userRepository.findByIds(vendorProfiles.map((v) => v.user_id));
      const verifiedUserIds = new Set(vendorUsers.filter((u) => u.email_verified).map((u) => u.id));
      if (vendorProfiles.some((v) => !verifiedUserIds.has(v.user_id))) {
        throw ApiError.badRequest("Some of the selected vendors are not approved");
      }

      const unavailableRows = await vendorUnavailabilityRepository.findByVendorProfileIdsAndDate(
        uniqueVendorProfileIds,
        event.preferred_date,
      );
      if (unavailableRows.length > 0) {
        throw ApiError.conflict("Some of the selected vendors are unavailable on the event date");
      }

      const pricingRows =
        await vendorPricingRepository.findByVendorProfileIds(uniqueVendorProfileIds);
      const pricingByKey = new Map(
        pricingRows.map((p) => [`${p.vendor_profile_id}:${p.pricing_type}`, p]),
      );

      for (const selection of selections) {
        const pricing = pricingByKey.get(
          `${selection.vendor_profile_id}:${selection.pricing_type}`,
        );
        if (!pricing) {
          throw ApiError.badRequest(
            `Vendor ${selection.vendor_profile_id} does not offer pricing type ${selection.pricing_type}`,
          );
        }
        rowsToCreate.push({
          vendor_profile_id: selection.vendor_profile_id,
          pricing_type: selection.pricing_type,
          amount: pricing.amount,
        });
      }
    }

    return sequelize.transaction(async (tx) => {
      await eventVendorRepository.deleteByEventId(event_id, tx);
      const created = await eventVendorRepository.bulkCreateForEvent(event_id, rowsToCreate, tx);
      const total_amount = created.reduce((sum, row) => sum + Number(row.amount), 0);
      const status = created.length > 0 ? EventStatus.VENDOR_SELECTED : EventStatus.DRAFT;
      await eventRepository.updateStatusAndTotal(event_id, { status, total_amount }, tx);

      const vendorProfilesForResponse = await vendorProfileRepository.findByIds(
        created.map((c) => c.vendor_profile_id),
      );
      const vendorProfileById = new Map(vendorProfilesForResponse.map((v) => [v.id, v]));

      return {
        event: {
          id: event.id,
          client_id: event.client_id,
          agent_profile_id: event.agent_profile_id,
          event_name: event.event_name,
          event_priority: event.event_priority,
          estimated_budget: event.estimated_budget,
          preferred_date: event.preferred_date,
          additional_notes: event.additional_notes,
          status,
          total_amount,
        },
        vendors: created.map((c) => ({
          vendor_profile_id: c.vendor_profile_id,
          business_name: vendorProfileById.get(c.vendor_profile_id)?.business_name ?? "",
          pricing_type: c.pricing_type,
          amount: c.amount,
        })),
      };
    });
  };
}

export default new EventVendorService();
