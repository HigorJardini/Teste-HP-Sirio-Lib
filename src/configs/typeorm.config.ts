import { DataSourceOptions } from "typeorm";
import { Users } from "../entities/users.entity";
import { Addresses } from "../entities/addresses.entity";
import { Cities } from "../entities/cities.entity";
import { States } from "../entities/states.entity";
import { Countries } from "../entities/countries.entity";
import { UserLogins } from "../entities/userLogins.entity";
import { ActionTypes } from "../entities/actionTypes.entity";
import { UserAuditLogs } from "../entities/userAuditLogs.entity";

export const typeOrmConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "siriodb",
  entities: [
    Users,
    Addresses,
    Cities,
    States,
    Countries,
    UserLogins,
    ActionTypes,
    UserAuditLogs,
  ],
  synchronize: true, // Development and testing: true
};
