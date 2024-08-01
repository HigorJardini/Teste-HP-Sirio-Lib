import { DataSource, Repository } from "typeorm";
import { States } from "../entities/states.entity";

export class StateRepository {
  private repository: Repository<States>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(States);
  }

  findOneByIsoCode(isoCode: string) {
    return this.repository.findOneBy({ iso_code: isoCode });
  }

  create(stateData: Partial<States>) {
    return this.repository.create(stateData);
  }

  save(state: States) {
    return this.repository.save(state);
  }
}
