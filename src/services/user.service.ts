import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Address } from "../entities/address.entity";
import { UserAudit } from "../entities/userAudit.entity";
import { ActionType } from "../entities/actionType.entity";

export class UserService {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  getDataSource() {
    return this.dataSource;
  }

  async createUser(userData: any, loginUserId: number) {
    const userRepo = this.dataSource.getRepository(User);
    const addressRepo = this.dataSource.getRepository(Address);
    const userAuditRepo = this.dataSource.getRepository(UserAudit);
    const actionTypeRepo = this.dataSource.getRepository(ActionType);

    let address;
    if (userData.address) {
      address = addressRepo.create(userData.address);
      await addressRepo.save(address);
    }

    const user = userRepo.create({
      ...userData,
      address: address ? address : null,
    });
    const savedUser = await userRepo.save(user);

    const actionType = await actionTypeRepo.findOneBy({
      action_type: "create",
    });

    // if (actionType) {
    //   const userAudit = userAuditRepo.create({
    //     user_id: savedUser[0],
    //     action_type_id: actionType.action_type_id,
    //     login_user_id: loginUserId,
    //   });
    //   await userAuditRepo.save(userAudit);
    // }

    return user;
  }

  async updateUser(id: bigint, userData: any, loginUserId: number) {
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOneBy({ user_id: id });
    if (user) {
      userRepo.merge(user, userData);
      await userRepo.save(user);
      const actionTypeRepo = this.dataSource.getRepository(ActionType);
      const userAuditRepo = this.dataSource.getRepository(UserAudit);
      const actionType = await actionTypeRepo.findOneBy({
        action_type: "update",
      });
      // if (actionType) {
      //   const userAudit = userAuditRepo.create({
      //     user_id: user.user_id,
      //     action_type_id: actionType.action_type_id,
      //     login_user_id: loginUserId,
      //   });
      //   await userAuditRepo.save(userAudit);
      // }
      return user;
    } else {
      return null;
    }
  }

  async deleteUser(id: bigint, loginUserId: number): Promise<boolean> {
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOneBy({ user_id: id });

    if (user) {
      await userRepo.remove(user);

      const actionTypeRepo = this.dataSource.getRepository(ActionType);
      const userAuditRepo = this.dataSource.getRepository(UserAudit);

      const actionType = await actionTypeRepo.findOneBy({
        action_type: "delete",
      });

      // if (actionType) {
      //   const userAudit = userAuditRepo.create({
      //     user_id: id,
      //     action_type_id: actionType.action_type_id,
      //     login_user_id: loginUserId,
      //   });
      //   await userAuditRepo.save(userAudit);
      // }

      return true;
    }

    return false;
  }

  async getUserById(id: bigint) {
    const userRepo = this.dataSource.getRepository(User);
    return userRepo.findOneBy({ user_id: id });
  }

  async getAllUsers() {
    const userRepo = this.dataSource.getRepository(User);
    return userRepo.find();
  }
}
