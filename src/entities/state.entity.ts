import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Country } from "./country.entity";

@Entity("State")
export class State {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  state_id!: bigint;

  @Column({ type: "varchar", length: 255 })
  state_name!: string;

  @ManyToOne(() => Country, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_id" })
  country!: Country;
}
