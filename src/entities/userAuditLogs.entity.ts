import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Users } from "./users.entity";
import { ActionTypes } from "./actionTypes.entity";
import { UserLogins } from "./userLogins.entity";

@Entity("UserAuditLogs")
export class UserAuditLogs {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  audit_id!: bigint;

  @ManyToOne(() => Users)
  @JoinColumn({ name: "user_id" })
  user_id!: Users;

  @ManyToOne(() => ActionTypes)
  @JoinColumn({ name: "action_type_id" })
  action_type!: ActionTypes;

  @ManyToOne(() => UserLogins)
  @JoinColumn({ name: "login_id" })
  login_user!: UserLogins;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  action_timestamp!: Date;
}
