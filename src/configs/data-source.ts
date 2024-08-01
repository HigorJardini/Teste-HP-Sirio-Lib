import { DataSource } from "typeorm";
import { UserLogins } from "../entities/userLogins.entity";
import { Users } from "../entities/users.entity";
import { Addresses } from "../entities/addresses.entity";
import { Cities } from "../entities/cities.entity";
import { States } from "../entities/states.entity";
import { Countries } from "../entities/countries.entity";
import { ActionTypes } from "../entities/actionTypes.entity";
import { UserAuditLogs } from "../entities/userAuditLogs.entity";

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
    UserLogins,
    Users,
    Addresses,
    Cities,
    States,
    Countries,
    ActionTypes,
    UserAuditLogs,
  ],
  migrations: [],
  subscribers: [],
});

export default dataSource;
