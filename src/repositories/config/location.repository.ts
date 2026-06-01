import { CreateLocationDto } from "@dto/config/location.dto";
import Location from "@models/config/Location.model";
import { Op } from "sequelize";

class LocationRepository {
  async create(data: CreateLocationDto): Promise<Location> {
    return Location.create(data);
  }
  async findAll(): Promise<Location[]> {
    return Location.findAll({ where: { status: true } });
  }

  async findById(id: number): Promise<Location | null> {
    return Location.findByPk(id);
  }

  async findByIds(ids: number[]): Promise<Location[]> {
    return Location.findAll({ where: { id: { [Op.in]: ids }, status: true }, attributes: ["id", "name"] });
  }
}

export default new LocationRepository();
