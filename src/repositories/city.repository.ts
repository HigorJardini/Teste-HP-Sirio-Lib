import { DataSource, Repository } from "typeorm";
import { Cities } from "../entities/cities.entity";

export class CityRepository {
  private repository: Repository<Cities>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Cities);
  }

  findOneByNameAndState(cityName: string, state: any) {
    return this.repository.findOne({ where: { city_name: cityName, state } });
  }

  create(cityData: Partial<Cities>) {
    return this.repository.create(cityData);
  }

  save(city: Cities) {
    return this.repository.save(city);
  }
}
