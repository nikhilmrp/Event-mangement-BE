import sequelize from "@config/database";
import {
  AddPaymentReceiptDto,
  CreateEventDto,
  EventPreviewResponseDto,
  EventResponseDto,
  EventWithReceiptsResponseDto,
  UpdateEventDto,
} from "@dto/event.dto";
import { EventVendorSummaryDto } from "@dto/eventVendor.dto";
import Event, { EventStatus } from "@models/agent/Event.model";
import agentProfileRepository from "@repositories/agentProfile.repository";
import clientRepository from "@repositories/client.repository";
import locationRepository from "@repositories/config/location.repository";
import eventRepository from "@repositories/event.repository";
import eventPaymentReceiptRepository from "@repositories/eventPaymentReceipt.repository";
import eventVendorRepository from "@repositories/eventVendor.repository";
import userRepository from "@repositories/user.repository";
import vendorProfileRepository from "@repositories/vendorProfile.repository";
import {
  assertAgentOwnership,
  resolveAgentScope,
} from "@services/helpers/resolveAgentProfileForRequest";
import ApiError from "@utils/ApiError";
import { JWTPayload } from "@utils/helpers";

class EventService {
  createEvent = async (user: JWTPayload, data: CreateEventDto): Promise<EventResponseDto> => {
    const {
      client_id,
      event_name,
      event_priority,
      estimated_budget,
      preferred_date,
      additional_notes,
    } = data;
    const scope = await resolveAgentScope(user);
    const client = await clientRepository.findById(client_id);
    if (!client) {
      throw ApiError.notFound("Client not found");
    }
    assertAgentOwnership(scope, client.agent_profile_id);

    const event = await eventRepository.create({
      client_id,
      agent_profile_id: client.agent_profile_id,
      event_name,
      event_priority,
      estimated_budget,
      preferred_date,
      additional_notes,
    });

    return this.toResponseDto(event);
  };

  updateEvent = async (user: JWTPayload, data: UpdateEventDto): Promise<EventResponseDto> => {
    const {
      event_id,
      event_name,
      event_priority,
      estimated_budget,
      preferred_date,
      additional_notes,
    } = data;
    const scope = await resolveAgentScope(user);
    const event = await eventRepository.findById(event_id);
    if (!event) {
      throw ApiError.notFound("Event not found");
    }
    assertAgentOwnership(scope, event.agent_profile_id);
    if (event.status === EventStatus.CONFIRMED || event.status === EventStatus.COMPLETED) {
      throw ApiError.badRequest(`Cannot edit a ${event.status} event`);
    }

    await eventRepository.update({
      id: event_id,
      event_name,
      event_priority,
      estimated_budget,
      preferred_date,
      additional_notes,
    });
    const updated = await eventRepository.findById(event_id);
    return this.toResponseDto(updated!);
  };

  getEventPreview = async (
    user: JWTPayload,
    event_id: number,
  ): Promise<EventPreviewResponseDto> => {
    const scope = await resolveAgentScope(user);
    const event = await eventRepository.findById(event_id);
    if (!event) {
      throw ApiError.notFound("Event not found");
    }
    assertAgentOwnership(scope, event.agent_profile_id);

    const client = await clientRepository.findById(event.client_id);
    if (!client) {
      throw ApiError.notFound("Client not found");
    }

    const [location, eventVendors, agentProfile, receipts] = await Promise.all([
      locationRepository.findById(client.location_id),
      eventVendorRepository.findByEventId(event_id),
      agentProfileRepository.findById(event.agent_profile_id),
      eventPaymentReceiptRepository.findByEventId(event_id),
    ]);
    const agentUser = agentProfile ? await userRepository.findByUserId(agentProfile.user_id) : null;

    const vendorProfiles = await vendorProfileRepository.findByIds(
      eventVendors.map((ev) => ev.vendor_profile_id),
    );
    const vendorProfileById = new Map(vendorProfiles.map((v) => [v.id, v]));

    const vendors: EventVendorSummaryDto[] = eventVendors.map((ev) => ({
      vendor_profile_id: ev.vendor_profile_id,
      business_name: vendorProfileById.get(ev.vendor_profile_id)?.business_name ?? "",
      pricing_type: ev.pricing_type,
      amount: ev.amount,
    }));

    return {
      agent: {
        id: event.agent_profile_id,
        name: agentUser ? `${agentUser.first_name} ${agentUser.last_name}` : "",
        email: agentUser?.email ?? null,
        phone: agentUser?.phone ?? "",
      },
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        location: { id: client.location_id, name: location?.name ?? "" },
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
        payment_receipts: receipts.map((r) => r.payment_receipt_url),
        confirmed_at: event.confirmed_at,
        completed_at: event.completed_at,
      },
      vendors,
    };
  };

  getEventsByStatus = async (
    user: JWTPayload,
    statuses: EventStatus[],
  ): Promise<EventPreviewResponseDto[]> => {
    const scope = await resolveAgentScope(user);
    const events = await eventRepository.findFiltered({
      agent_profile_id: scope.agentProfileId ?? undefined,
      statuses,
    });
    if (!events.length) return [];

    const clients = await clientRepository.findByIds([
      ...new Set(events.map((e) => e.client_id)),
    ]);
    const clientById = new Map(clients.map((c) => [c.id, c]));

    const agentProfiles = await agentProfileRepository.findByIds([
      ...new Set(events.map((e) => e.agent_profile_id)),
    ]);
    const agentProfileById = new Map(agentProfiles.map((ap) => [ap.id, ap]));
    const agentUsers = await userRepository.findByIds([
      ...new Set(agentProfiles.map((ap) => ap.user_id)),
    ]);
    const agentUserById = new Map(agentUsers.map((u) => [u.id, u]));

    const eventIds = events.map((e) => e.id);
    const [locations, eventVendors, receipts] = await Promise.all([
      locationRepository.findByIds([...new Set(clients.map((c) => c.location_id))]),
      eventVendorRepository.findByEventIds(eventIds),
      eventPaymentReceiptRepository.findByEventIds(eventIds),
    ]);
    const locationById = new Map(locations.map((l) => [l.id, l]));

    const receiptsByEventId = new Map<number, string[]>();
    for (const receipt of receipts) {
      const list = receiptsByEventId.get(receipt.event_id) ?? [];
      list.push(receipt.payment_receipt_url);
      receiptsByEventId.set(receipt.event_id, list);
    }

    const vendorProfiles = await vendorProfileRepository.findByIds([
      ...new Set(eventVendors.map((ev) => ev.vendor_profile_id)),
    ]);
    const vendorProfileById = new Map(vendorProfiles.map((v) => [v.id, v]));

    const eventVendorsByEventId = new Map<number, EventVendorSummaryDto[]>();
    for (const ev of eventVendors) {
      const list = eventVendorsByEventId.get(ev.event_id) ?? [];
      list.push({
        vendor_profile_id: ev.vendor_profile_id,
        business_name: vendorProfileById.get(ev.vendor_profile_id)?.business_name ?? "",
        pricing_type: ev.pricing_type,
        amount: ev.amount,
      });
      eventVendorsByEventId.set(ev.event_id, list);
    }

    return events.map((event) => {
      const client = clientById.get(event.client_id);
      const location = client ? locationById.get(client.location_id) : undefined;
      const agentProfile = agentProfileById.get(event.agent_profile_id);
      const agentUser = agentProfile ? agentUserById.get(agentProfile.user_id) : undefined;
      return {
        agent: {
          id: event.agent_profile_id,
          name: agentUser ? `${agentUser.first_name} ${agentUser.last_name}` : "",
          email: agentUser?.email ?? null,
          phone: agentUser?.phone ?? "",
        },
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
          payment_receipts: receiptsByEventId.get(event.id) ?? [],
          confirmed_at: event.confirmed_at,
          completed_at: event.completed_at,
        },
        vendors: eventVendorsByEventId.get(event.id) ?? [],
      };
    });
  };

  // The first receipt (e.g. an advance) confirms the event; further receipts can
  // be added any number of times until an admin marks the event completed.
  addPaymentReceipt = async (
    user: JWTPayload,
    data: AddPaymentReceiptDto,
  ): Promise<EventWithReceiptsResponseDto> => {
    const { event_id, payment_receipt_url } = data;
    const scope = await resolveAgentScope(user);
    const event = await eventRepository.findById(event_id);
    if (!event) {
      throw ApiError.notFound("Event not found");
    }
    assertAgentOwnership(scope, event.agent_profile_id);
    if (event.status === EventStatus.COMPLETED) {
      throw ApiError.badRequest("Cannot upload receipts for a completed event");
    }
    if (event.status === EventStatus.DRAFT) {
      throw ApiError.badRequest("Select at least one vendor before confirming");
    }

    await sequelize.transaction(async (tx) => {
      await eventPaymentReceiptRepository.create({ event_id, payment_receipt_url }, tx);
      if (event.status === EventStatus.VENDOR_SELECTED) {
        await eventRepository.markConfirmed(event_id, new Date(), tx);
      }
    });

    const [updated, receipts] = await Promise.all([
      eventRepository.findById(event_id),
      eventPaymentReceiptRepository.findByEventId(event_id),
    ]);
    return {
      ...this.toResponseDto(updated!),
      payment_receipts: receipts.map((r) => r.payment_receipt_url),
    };
  };

  completeEvent = async (event_id: number): Promise<EventResponseDto> => {
    const event = await eventRepository.findById(event_id);
    if (!event) {
      throw ApiError.notFound("Event not found");
    }
    if (event.status !== EventStatus.CONFIRMED) {
      throw ApiError.badRequest("Only confirmed events can be completed");
    }

    await eventRepository.markCompleted(event_id, new Date());
    const updated = await eventRepository.findById(event_id);
    return this.toResponseDto(updated!);
  };

  private toResponseDto = (event: Event): EventResponseDto => ({
    id: event.id,
    client_id: event.client_id,
    agent_profile_id: event.agent_profile_id,
    event_name: event.event_name,
    event_priority: event.event_priority,
    estimated_budget: event.estimated_budget,
    preferred_date: event.preferred_date,
    additional_notes: event.additional_notes,
    status: event.status,
    total_amount: event.total_amount,
  });
}

export default new EventService();
