import { DataSource } from "typeorm";
import { LoginUser } from "../entities/loginUser.entity";
import { User } from "../entities/user.entity";
import { Address } from "../entities/address.entity";
import { City } from "../entities/city.entity";
import { State } from "../entities/state.entity";
import { Country } from "../entities/country.entity";
import { ActionType } from "../entities/actionType.entity";
import { UserAudit } from "../entities/userAudit.entity";

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "siriodb",
  synchronize: false, // Development and testing: true
  logging: true, // Enable logging for debugging
  entities: [
    LoginUser,
    User,
    Address,
    City,
    State,
    Country,
    ActionType,
    UserAudit,
  ],
  migrations: [],
  subscribers: [],
});

export default dataSource;
