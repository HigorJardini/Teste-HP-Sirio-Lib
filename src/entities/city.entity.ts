import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { State } from "./state.entity";

@Entity("Citys")
export class City {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  city_id!: bigint;

  @Column({ type: "varchar", length: 255 })
  city_name!: string;

  @ManyToOne(() => State, { onDelete: "CASCADE" })
  @JoinColumn({ name: "state_id" })
  state: State = new State();
}
