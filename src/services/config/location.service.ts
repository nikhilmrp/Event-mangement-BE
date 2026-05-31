import { CreateLocationDto, LocationResponseDto } from "@dto/config/location.dto";
import locationRepository from "@repositories/config/location.repository";

class LocationService {
  async createLocation(data: CreateLocationDto): Promise<LocationResponseDto> {
    const location = await locationRepository.create(data);
    return location;
  }

  async getLocations(): Promise<LocationResponseDto[]> {
    const locations = await locationRepository.findAll();
    return locations.map((location) => {
      return {
        ...location.toJSON(),
        id: location.id,
      };
    });
  }
}

export default new LocationService();
