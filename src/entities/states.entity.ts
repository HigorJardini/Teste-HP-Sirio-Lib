import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Countries } from "./countries.entity";

@Entity("States")
export class States {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  state_id!: bigint;

  @Column({ type: "varchar", length: 255 })
  state_name!: string;

  @ManyToOne(() => Countries, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_id" })
  country!: Countries;
}
