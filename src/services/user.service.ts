import { DataSource } from "typeorm";
import { UserRepository } from "../repositories/user.repository";
import { AddressRepository } from "../repositories/address.repository";
import { ActionTypeRepository } from "../repositories/action-type.repository";
import { UserAuditLogRepository } from "../repositories/user-audit-log.repository";
import { CityRepository } from "../repositories/city.repository";
import { StateRepository } from "../repositories/state.repository";
import { CountryRepository } from "../repositories/country.repository";
import { UserLoginRepository } from "../repositories/user-login.repository";

export class UserService {
  private userRepo: UserRepository;
  private addressRepo: AddressRepository;
  private actionTypeRepo: ActionTypeRepository;
  private userAuditRepo: UserAuditLogRepository;
  private cityRepo: CityRepository;
  private stateRepo: StateRepository;
  private countryRepo: CountryRepository;
  private loginUserRepo: UserLoginRepository;

  constructor(dataSource: DataSource) {
    this.userRepo = new UserRepository(dataSource);
    this.addressRepo = new AddressRepository(dataSource);
    this.actionTypeRepo = new ActionTypeRepository(dataSource);
    this.userAuditRepo = new UserAuditLogRepository(dataSource);
    this.cityRepo = new CityRepository(dataSource);
    this.stateRepo = new StateRepository(dataSource);
    this.countryRepo = new CountryRepository(dataSource);
    this.loginUserRepo = new UserLoginRepository(dataSource);
  }

  async createUser(userData: any, loginUserId: number) {
    // Check if a user with the same CPF already exists
    const existingUser = await this.userRepo.findOneByCpf(userData.cpf);
    if (existingUser) {
      throw new Error("User with this CPF already exists");
    }

    let address;

    if (userData.address) {
      // Country exists check
      let country = await this.countryRepo.findOneByIsoCode(
        userData.address.city.state.country.iso_code
      );
      if (!country) {
        // Create the country if it does not exist
        country = this.countryRepo.create({
          country_name: userData.address.city.state.country.country_name,
          iso_code: userData.address.city.state.country.iso_code,
        });
        await this.countryRepo.save(country);
      }

      // State exists check
      let state = await this.stateRepo.findOneByIsoCode(
        userData.address.city.state.iso_code
      );
      if (!state) {
        // Create the state if it does not exist
        state = this.stateRepo.create({
          state_name: userData.address.city.state.state_name,
          iso_code: userData.address.city.state.iso_code,
          country: country,
        });
        await this.stateRepo.save(state);
      }

      // City exists check
      let city = await this.cityRepo.findOneByNameAndState(
        userData.address.city.city_name,
        state
      );
      if (!city) {
        // Create the city if it does not exist
        city = this.cityRepo.create({
          city_name: userData.address.city.city_name,
          state: state,
        });
        await this.cityRepo.save(city);
      }

      // Create address
      address = this.addressRepo.create({
        ...userData.address,
        city: city,
      });
      await this.addressRepo.save(address);
    }

    // Create user
    const user = this.userRepo.create({
      ...userData,
      address: address ? address : null,
    });
    const savedUser = await this.userRepo.save(user);

    // Log user creation
    const actionType = await this.actionTypeRepo.findOneByType("create");
    const loginUser = await this.loginUserRepo.findOneByLoginId(
      BigInt(loginUserId)
    );

    if (actionType && loginUser) {
      const userAudit = this.userAuditRepo.create({
        user_id: savedUser,
        action_type: actionType,
        login_user: loginUser,
      });

      await this.userAuditRepo.save(userAudit);
    }

    return savedUser;
  }

  async updateUser(id: bigint, userData: any, loginUserId: number) {
    const user = await this.userRepo.findOneById(id);

    if (user) {
      if (userData.cpf && userData.cpf !== user.cpf) {
        const existingUser = await this.userRepo.findOneByCpf(userData.cpf);
        if (existingUser && existingUser.deleted_at === null) {
          throw new Error("User with this CPF already exists");
        }
      }

      if (userData.address) {
        // Country exists check
        let country = await this.countryRepo.findOneByIsoCode(
          userData.address.city.state.country.iso_code
        );
        if (!country) {
          // Create the country if it does not exist
          country = this.countryRepo.create({
            country_name: userData.address.city.state.country.country_name,
            iso_code: userData.address.city.state.country.iso_code,
          });
          await this.countryRepo.save(country);
        }

        // State exists check
        let state = await this.stateRepo.findOneByIsoCode(
          userData.address.city.state.iso_code
        );
        if (!state) {
          // Create the state if it does not exist
          state = this.stateRepo.create({
            state_name: userData.address.city.state.state_name,
            iso_code: userData.address.city.state.iso_code,
            country: country,
          });
          await this.stateRepo.save(state);
        }

        // City exists check
        let city = await this.cityRepo.findOneByNameAndState(
          userData.address.city.city_name,
          state
        );
        if (!city) {
          // Create the city if it does not exist
          city = this.cityRepo.create({
            city_name: userData.address.city.city_name,
            state: state,
          });
          await this.cityRepo.save(city);
        }

        // Create or update the address
        if (user.address) {
          user.address = this.addressRepo.merge(user.address, {
            ...userData.address,
            city: city,
          });
          await this.addressRepo.save(user.address);
        } else {
          const newAddress = this.addressRepo.create({
            ...userData.address,
            city: city,
          });
          await this.addressRepo.save(newAddress);
        }
      } else if (user.address) {
        await this.addressRepo.remove(user.address);
        user.address = null;
      }

      // Update the user
      this.userRepo.merge(user, userData);
      await this.userRepo.save(user);

      // Log user update
      const actionType = await this.actionTypeRepo.findOneByType("update");
      const loginUser = await this.loginUserRepo.findOneByLoginId(
        BigInt(loginUserId)
      );

      if (actionType && loginUser) {
        const userAudit = this.userAuditRepo.create({
          user_id: user,
          action_type: actionType,
          login_user: loginUser,
        });

        await this.userAuditRepo.save(userAudit);
      }

      return user;
    } else {
      return null;
    }
  }

  async deleteUser(id: bigint, loginUserId: number): Promise<boolean> {
    const user = await this.userRepo.findOneById(id);

    if (user) {
      user.deleted_at = new Date();
      user.is_active = false;
      await this.userRepo.save(user);

      // Log delete user
      const actionType = await this.actionTypeRepo.findOneByType("delete");
      const loginUser = await this.loginUserRepo.findOneByLoginId(
        BigInt(loginUserId)
      );

      if (actionType && loginUser) {
        const userAudit = this.userAuditRepo.create({
          user_id: user,
          action_type: actionType,
          login_user: loginUser,
        });

        await this.userAuditRepo.save(userAudit);
      }

      return true;
    }

    return false;
  }

  async getUserById(id: bigint) {
    return this.userRepo.findOneById(id);
  }

  async getAllUsers() {
    return this.userRepo.findAll();
  }
}
