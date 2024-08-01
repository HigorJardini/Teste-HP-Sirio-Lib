import { DataSource, Repository } from "typeorm";
import { Addresses } from "../entities/addresses.entity";

export class AddressRepository {
  private repository: Repository<Addresses>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Addresses);
  }

  create(addressData: Partial<Addresses>) {
    return this.repository.create(addressData);
  }

  save(address: Addresses) {
    return this.repository.save(address);
  }

  remove(address: Addresses) {
    return this.repository.remove(address);
  }

  merge(address: Addresses, addressData: Partial<Addresses>) {
    return this.repository.merge(address, addressData);
  }
}
