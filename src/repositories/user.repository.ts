import { DataSource, Repository } from "typeorm";
import { Users } from "../entities/users.entity";

export class UserRepository {
  private repository: Repository<Users>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Users);
  }

  findOneByCpf(cpf: string) {
    return this.repository.findOneBy({ cpf });
  }

  create(userData: Partial<Users>) {
    return this.repository.create(userData);
  }

  save(user: Users) {
    return this.repository.save(user);
  }

  findOneById(id: bigint) {
    return this.repository.findOne({
      where: { user_id: id, deleted_at: undefined },
      relations: ["address"],
    });
  }

  findAll() {
    return this.repository.find({
      where: { deleted_at: undefined },
      relations: ["address"],
    });
  }

  update(userId: bigint, userData: Partial<Users>) {
    return this.repository.update(Number(userId), userData);
  }

  merge(user: Users, userData: Partial<Users>) {
    return this.repository.merge(user, userData);
  }
}
