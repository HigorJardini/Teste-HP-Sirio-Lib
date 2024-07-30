import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { States } from "./states.entity";

@Entity("Cities")
export class Cities {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  city_id!: bigint;

  @Column({ type: "varchar", length: 255 })
  city_name!: string;

  @ManyToOne(() => States, { onDelete: "CASCADE" })
  @JoinColumn({ name: "state_id" })
  state: States = new States();
}
