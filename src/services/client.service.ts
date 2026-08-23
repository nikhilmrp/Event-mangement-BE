import { ClientListItemDto, ClientResponseDto, CreateClientDto, UpdateClientDto } from "@dto/client.dto";
import { EventListItemDto } from "@dto/event.dto";
import { EventVendorSummaryDto } from "@dto/eventVendor.dto";
import clientRepository from "@repositories/client.repository";
import locationRepository from "@repositories/config/location.repository";
import eventRepository from "@repositories/event.repository";
import eventVendorRepository from "@repositories/eventVendor.repository";
import vendorProfileRepository from "@repositories/vendorProfile.repository";
import {
  assertAgentOwnership,
  resolveAgentProfileIdForCreate,
  resolveAgentScope,
} from "@services/helpers/resolveAgentProfileForRequest";
import ApiError from "@utils/ApiError";
import { JWTPayload } from "@utils/helpers";

class ClientService {
  createClient = async (user: JWTPayload, data: CreateClientDto): Promise<ClientResponseDto> => {
    const { name, email, phone, address, location_id, agent_id } = data;
    const agentProfileId = await resolveAgentProfileIdForCreate(user, agent_id);

    const location = await locationRepository.findById(location_id);
    if (!location) {
      throw ApiError.notFound("Location not found");
    }

    const client = await clientRepository.create({
      agent_profile_id: agentProfileId,
      name,
      email,
      phone,
      address,
      location_id,
    });

    return this.toResponseDto(client);
  };

  updateClient = async (user: JWTPayload, data: UpdateClientDto): Promise<ClientResponseDto> => {
    const { client_id, name, email, phone, address, location_id } = data;
    const scope = await resolveAgentScope(user);
    const client = await clientRepository.findById(client_id);
    if (!client) {
      throw ApiError.notFound("Client not found");
    }
    assertAgentOwnership(scope, client.agent_profile_id);

    if (location_id !== undefined) {
      const location = await locationRepository.findById(location_id);
      if (!location) {
        throw ApiError.notFound("Location not found");
      }
    }

    await clientRepository.update({ id: client_id, name, email, phone, address, location_id });
    const updated = await clientRepository.findById(client_id);
    return this.toResponseDto(updated!);
  };

  getClientsWithNestedEventsAndVendors = async (
    user: JWTPayload,
  ): Promise<ClientListItemDto[]> => {
    const scope = await resolveAgentScope(user);
    const clients =
      scope.agentProfileId !== null
        ? await clientRepository.findByAgentProfileId(scope.agentProfileId)
        : await clientRepository.findAll();
    if (!clients.length) return [];

    const events =
      scope.agentProfileId !== null
        ? await eventRepository.findByAgentProfileId(scope.agentProfileId)
        : await eventRepository.findAll();

    const [eventVendors, locations] = await Promise.all([
      eventVendorRepository.findByEventIds(events.map((e) => e.id)),
      locationRepository.findByIds([...new Set(clients.map((c) => c.location_id))]),
    ]);

    const vendorProfiles = await vendorProfileRepository.findByIds([
      ...new Set(eventVendors.map((ev) => ev.vendor_profile_id)),
    ]);
    const vendorProfileById = new Map(vendorProfiles.map((v) => [v.id, v]));
    const locationById = new Map(locations.map((l) => [l.id, l]));

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

    const eventsByClientId = new Map<number, EventListItemDto[]>();
    for (const event of events) {
      const list = eventsByClientId.get(event.client_id) ?? [];
      list.push({
        id: event.id,
        event_name: event.event_name,
        event_priority: event.event_priority,
        estimated_budget: event.estimated_budget,
        preferred_date: event.preferred_date,
        status: event.status,
        total_amount: event.total_amount,
        vendors: eventVendorsByEventId.get(event.id) ?? [],
      });
      eventsByClientId.set(event.client_id, list);
    }

    return clients.map((client) => {
      const location = locationById.get(client.location_id);
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        location: { id: client.location_id, name: location?.name ?? "" },
        events: eventsByClientId.get(client.id) ?? [],
      };
    });
  };

  private toResponseDto = (client: {
    id: number;
    agent_profile_id: number;
    name: string;
    email: string | null;
    phone: string;
    address: string;
    location_id: number;
  }): ClientResponseDto => ({
    id: client.id,
    agent_profile_id: client.agent_profile_id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    location_id: client.location_id,
  });
}

export default new ClientService();
