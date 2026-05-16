import { CreateLocationDto, LocationResponseDto } from "@dto/config/location.dto";
import locationRepository from "@repositories/config/location.repository";

class LocationService {
  async createLocation(data: CreateLocationDto): Promise<LocationResponseDto> {
    const location = await locationRepository.create(data);
    return location;
  }
}

export default new LocationService();
