import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("ActionTypes")
export class ActionTypes {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  action_type_id!: bigint;

  @Column({ type: "varchar", length: 50 })
  action_type!: "create" | "update" | "delete";
}
