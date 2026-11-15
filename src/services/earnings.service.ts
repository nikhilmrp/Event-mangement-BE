import { EarningsListItemDto, MyEarningsResponseDto } from "@dto/earnings.dto";
import { UserRole } from "@models/User.model";
import agentProfileRepository from "@repositories/agentProfile.repository";
import eventEarningRepository from "@repositories/eventEarning.repository";
import userRepository from "@repositories/user.repository";
import vendorProfileRepository from "@repositories/vendorProfile.repository";
import ApiError from "@utils/ApiError";
import { JWTPayload } from "@utils/helpers";

class EarningsService {
  getMyEarnings = async (user: JWTPayload): Promise<MyEarningsResponseDto> => {
    if (user.role === UserRole.AGENT) {
      const profile = await agentProfileRepository.findByUserId(user.id);
      if (!profile) throw ApiError.notFound("Agent profile not found");
      return this.totalFor("agent_profile_id", profile.id);
    }
    if (user.role === UserRole.VENDOR) {
      const profile = await vendorProfileRepository.findByUserId(user.id);
      if (!profile) throw ApiError.notFound("Vendor profile not found");
      return this.totalFor("vendor_profile_id", profile.id);
    }
    throw ApiError.badRequest("Earnings are only available for agents and vendors");
  };

  getEarningsList = async (role: UserRole, search?: string): Promise<EarningsListItemDto[]> => {
    const profiles: { id: number; user_id: number; business_name?: string }[] =
      role === UserRole.AGENT
        ? (await agentProfileRepository.findAll()).map((p) => ({ id: p.id, user_id: p.user_id }))
        : (await vendorProfileRepository.findAll()).map((p) => ({
            id: p.id,
            user_id: p.user_id,
            business_name: p.business_name,
          }));
    if (!profiles.length) return [];

    const ownerField = role === UserRole.AGENT ? "agent_profile_id" : "vendor_profile_id";
    const [users, totals] = await Promise.all([
      userRepository.findByIds([...new Set(profiles.map((p) => p.user_id))]),
      eventEarningRepository.sumByOwner(
        ownerField,
        profiles.map((p) => p.id),
      ),
    ]);
    const userById = new Map(users.map((u) => [u.id, u]));
    const totalByProfileId = new Map(totals.map((t) => [t.profile_id, t]));

    const items: EarningsListItemDto[] = profiles.map((profile) => {
      const user = userById.get(profile.user_id);
      const total = totalByProfileId.get(profile.id);
      return {
        profile_id: profile.id,
        user_id: profile.user_id,
        name: user ? `${user.first_name} ${user.last_name}` : "",
        email: user?.email ?? null,
        phone: user?.phone ?? "",
        ...(profile.business_name !== undefined ? { business_name: profile.business_name } : {}),
        total_earnings: total?.total_earnings ?? 0,
        completed_events: total?.completed_events ?? 0,
      };
    });

    const term = search?.toLowerCase();
    const filtered = term
      ? items.filter((i) =>
          [i.name, i.email ?? "", i.phone, i.business_name ?? ""].some((v) =>
            v.toLowerCase().includes(term),
          ),
        )
      : items;

    return filtered.sort((a, b) => b.total_earnings - a.total_earnings);
  };

  private totalFor = async (
    ownerField: "agent_profile_id" | "vendor_profile_id",
    profileId: number,
  ): Promise<MyEarningsResponseDto> => {
    const [row] = await eventEarningRepository.sumByOwner(ownerField, [profileId]);
    return {
      profile_id: profileId,
      total_earnings: row?.total_earnings ?? 0,
      completed_events: row?.completed_events ?? 0,
    };
  };
}

export default new EarningsService();
