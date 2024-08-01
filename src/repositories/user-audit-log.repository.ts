import { DataSource, Repository } from "typeorm";
import { UserAuditLogs } from "../entities/userAuditLogs.entity";

export class UserAuditLogRepository {
  private repository: Repository<UserAuditLogs>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserAuditLogs);
  }

  create(userAuditData: Partial<UserAuditLogs>) {
    return this.repository.create(userAuditData);
  }

  save(userAudit: UserAuditLogs) {
    return this.repository.save(userAudit);
  }
}
