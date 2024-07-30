import { DataSourceOptions } from "typeorm";
import { User } from "../entities/user.entity";
import { Address } from "../entities/address.entity";
import { City } from "../entities/city.entity";
import { State } from "../entities/state.entity";
import { Country } from "../entities/country.entity";
import { LoginUser } from "../entities/loginUser.entity";
import { ActionType } from "../entities/actionType.entity";
import { UserAudit } from "../entities/userAudit.entity";

export const typeOrmConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "siriodb",
  entities: [
    User,
    Address,
    City,
    State,
    Country,
    LoginUser,
    ActionType,
    UserAudit,
  ],
  synchronize: true, // Development and testing: true
};
