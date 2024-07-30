import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("ActionType")
export class ActionType {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  action_type_id!: bigint;

  @Column({ type: "varchar", length: 50 })
  action_type!: "create" | "update" | "delete";
}
