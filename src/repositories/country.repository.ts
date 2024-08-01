import { DataSource, Repository } from "typeorm";
import { Countries } from "../entities/countries.entity";

export class CountryRepository {
  private repository: Repository<Countries>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Countries);
  }

  findOneByIsoCode(isoCode: string) {
    return this.repository.findOneBy({ iso_code: isoCode });
  }

  create(countryData: Partial<Countries>) {
    return this.repository.create(countryData);
  }

  save(country: Countries) {
    return this.repository.save(country);
  }
}
