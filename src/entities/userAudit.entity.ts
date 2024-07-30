import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { ActionType } from "./actionType.entity";
import { LoginUser } from "./loginUser.entity";

@Entity("UserAudit")
export class UserAudit {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  audit_id!: bigint;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => ActionType)
  @JoinColumn({ name: "action_type_id" })
  action_type!: ActionType;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  action_time!: Date;

  @ManyToOne(() => LoginUser)
  @JoinColumn({ name: "login_user_id" })
  login_user!: LoginUser;
}
