import { CreateLocationDto } from "@dto/config/location.dto";
import Location from "@models/config/Location.model";

class LocationRepository {
  async create(data: CreateLocationDto): Promise<Location> {
    return Location.create(data);
  }
}

export default new LocationRepository();
