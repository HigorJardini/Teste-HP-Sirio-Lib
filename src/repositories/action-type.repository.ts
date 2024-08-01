import { DataSource, Repository } from "typeorm";
import { ActionTypes } from "../entities/actionTypes.entity";

export class ActionTypeRepository {
  private repository: Repository<ActionTypes>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(ActionTypes);
  }

  findOneByType(actionType: "create" | "update" | "delete") {
    return this.repository.findOneBy({ action_type: actionType });
  }
}
