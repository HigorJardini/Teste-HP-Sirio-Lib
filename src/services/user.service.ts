import { DataSource } from "typeorm";
import { Users } from "../entities/users.entity";
import { Addresses } from "../entities/addresses.entity";
import { UserAuditLogs } from "../entities/userAuditLogs.entity";
import { ActionTypes } from "../entities/actionTypes.entity";
import { Cities } from "../entities/cities.entity";
import { States } from "../entities/states.entity";
import { Countries } from "../entities/countries.entity";
import { UserLogins } from "../entities/userLogins.entity";

export class UserService {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  getDataSource() {
    return this.dataSource;
  }

  async createUser(userData: any, loginUserId: number) {
    const userRepo = this.dataSource.getRepository(Users);
    const addressRepo = this.dataSource.getRepository(Addresses);
    const actionTypeRepo = this.dataSource.getRepository(ActionTypes);
    const userAuditRepo = this.dataSource.getRepository(UserAuditLogs);
    const cityRepo = this.dataSource.getRepository(Cities);
    const stateRepo = this.dataSource.getRepository(States);
    const countryRepo = this.dataSource.getRepository(Countries);
    const loginUserRepo = this.dataSource.getRepository(UserLogins);

    // Check if a user with the same CPF already exists
    const existingUser = await userRepo.findOneBy({ cpf: userData.cpf });
    if (existingUser) {
      throw new Error("User with this CPF already exists");
    }

    let address;

    if (userData.address) {
      // Country exists check
      let country = await countryRepo.findOneBy({
        iso_code: userData.address.city.state.country.iso_code,
      });
      if (!country) {
        // Create the country if it does not exist
        country = countryRepo.create({
          country_name: userData.address.city.state.country.country_name,
          iso_code: userData.address.city.state.country.iso_code,
        });
        await countryRepo.save(country);
      }

      // State exists check
      let state = await stateRepo.findOneBy({
        iso_code: userData.address.city.state.iso_code,
      });
      if (!state) {
        // Create the state if it does not exist
        state = stateRepo.create({
          state_name: userData.address.city.state.state_name,
          iso_code: userData.address.city.state.iso_code,
          country: country,
        });
        await stateRepo.save(state);
      }

      // City exists check
      let city = await cityRepo.findOne({
        where: { city_name: userData.address.city.city_name, state: state },
      });
      if (!city) {
        // Create the city if it does not exist
        city = cityRepo.create({
          city_name: userData.address.city.city_name,
          state: state,
        });
        await cityRepo.save(city);
      }

      // Create address
      address = addressRepo.create({
        ...userData.address,
        city: city,
      });
      await addressRepo.save(address);
    }

    // Create user
    const user = userRepo.create({
      ...userData,
      address: address ? address : null,
    });
    const savedUser = await userRepo.save(user);

    // Log user creation
    if (savedUser instanceof Users) {
      const actionType = await actionTypeRepo.findOneBy({
        action_type: "create",
      });
      const loginUser = await loginUserRepo.findOneBy({
        login_id: BigInt(loginUserId),
      });

      if (actionType && loginUser) {
        const userAudit = userAuditRepo.create({
          user_id: savedUser,
          action_type: actionType,
          login_user: loginUser,
        });

        await userAuditRepo.save(userAudit);
      }
    } else {
      console.log("oi");
    }

    return savedUser;
  }

  async updateUser(id: bigint, userData: any, loginUserId: number) {
    const userRepo = this.dataSource.getRepository(Users);
    const addressRepo = this.dataSource.getRepository(Addresses);
    const cityRepo = this.dataSource.getRepository(Cities);
    const stateRepo = this.dataSource.getRepository(States);
    const countryRepo = this.dataSource.getRepository(Countries);
    const actionTypeRepo = this.dataSource.getRepository(ActionTypes);
    const userAuditRepo = this.dataSource.getRepository(UserAuditLogs);
    const loginUserRepo = this.dataSource.getRepository(UserLogins);

    const user = await userRepo.findOne({
      where: { user_id: id, deleted_at: undefined },
      relations: ["address"],
    });

    if (user) {
      if (userData.address) {
        // Country exists check
        let country = await countryRepo.findOneBy({
          iso_code: userData.address.city.state.country.iso_code,
        });
        if (!country) {
          // Create the country if it does not exist
          country = countryRepo.create({
            country_name: userData.address.city.state.country.country_name,
            iso_code: userData.address.city.state.country.iso_code,
          });
          await countryRepo.save(country);
        }

        // State exists check
        let state = await stateRepo.findOneBy({
          iso_code: userData.address.city.state.iso_code,
        });
        if (!state) {
          // Create the state if it does not exist
          state = stateRepo.create({
            state_name: userData.address.city.state.state_name,
            iso_code: userData.address.city.state.iso_code,
            country: country,
          });
          await stateRepo.save(state);
        }

        // City exists check
        let city = await cityRepo.findOne({
          where: { city_name: userData.address.city.city_name, state: state },
        });
        if (!city) {
          // Create the city if it does not exist
          city = cityRepo.create({
            city_name: userData.address.city.city_name,
            state: state,
          });
          await cityRepo.save(city);
        }

        // Create or update the address
        if (user.address) {
          user.address = addressRepo.merge(user.address, {
            ...userData.address,
            city: city,
          });
          await addressRepo.save(user.address);
        } else {
          const newAddress = addressRepo.create({
            ...userData.address,
            city: city,
          });
          await addressRepo.save(newAddress);
        }
      } else if (user.address) {
        await addressRepo.remove(user.address);
        user.address = null;
      }

      // Update the user
      userRepo.merge(user, userData);
      await userRepo.save(user);

      // Log user update
      const actionType = await actionTypeRepo.findOneBy({
        action_type: "update",
      });
      const loginUser = await loginUserRepo.findOneBy({
        login_id: BigInt(loginUserId),
      });

      if (actionType && loginUser) {
        const userAudit = userAuditRepo.create({
          user_id: user,
          action_type: actionType,
          login_user: loginUser,
        });

        await userAuditRepo.save(userAudit);
      }

      return user;
    } else {
      return null;
    }
  }

  async deleteUser(id: bigint, loginUserId: number): Promise<boolean> {
    const userRepo = this.dataSource.getRepository(Users);
    const addressRepo = this.dataSource.getRepository(Addresses);
    const actionTypeRepo = this.dataSource.getRepository(ActionTypes);
    const userAuditRepo = this.dataSource.getRepository(UserAuditLogs);
    const loginUserRepo = this.dataSource.getRepository(UserLogins);

    const user = await userRepo.findOne({
      where: { user_id: id, deleted_at: undefined },
      relations: ["address"],
    });

    if (user) {
      user.deleted_at = new Date();
      user.is_active = false;
      await userRepo.save(user);

      // Log delete user
      const actionType = await actionTypeRepo.findOneBy({
        action_type: "delete",
      });
      const loginUser = await loginUserRepo.findOneBy({
        login_id: BigInt(loginUserId),
      });

      if (actionType && loginUser) {
        const userAudit = userAuditRepo.create({
          user_id: user,
          action_type: actionType,
          login_user: loginUser,
        });

        await userAuditRepo.save(userAudit);
      }

      return true;
    }

    return false;
  }

  async getUserById(id: bigint) {
    const userRepo = this.dataSource.getRepository(Users);
    return userRepo.findOne({
      where: { user_id: id, deleted_at: undefined },
      relations: ["address"],
    });
  }

  async getAllUsers() {
    const userRepo = this.dataSource.getRepository(Users);
    return userRepo.find({
      where: { deleted_at: undefined },
      relations: ["address"],
    });
  }
}
