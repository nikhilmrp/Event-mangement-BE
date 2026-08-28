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
    return Location.findAll({
      where: { id: { [Op.in]: ids }, status: true },
      attributes: ["id", "name"],
    });
  }

  async findByName(name: string): Promise<Location | null> {
    return Location.findOne({ where: { name, status: true } });
  }

  async findIdsByNameLike(term: string): Promise<number[]> {
    const locations = await Location.findAll({
      where: { name: { [Op.like]: `%${term}%` }, status: true },
      attributes: ["id"],
    });
    return locations.map((location) => location.id);
  }
}

export default new LocationRepository();
