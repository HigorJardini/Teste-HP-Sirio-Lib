import { DataSource, Repository } from "typeorm";
import { UserLogins } from "../entities/userLogins.entity";

export class UserLoginRepository {
  private repository: Repository<UserLogins>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserLogins);
  }

  findOneByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }

  findOneByLoginId(loginId: bigint) {
    return this.repository.findOneBy({ login_id: loginId });
  }

  create(userLoginData: Partial<UserLogins>) {
    return this.repository.create(userLoginData);
  }

  save(userLogin: UserLogins) {
    return this.repository.save(userLogin);
  }
}
