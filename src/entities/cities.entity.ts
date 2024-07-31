import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { States } from "./states.entity";
import { Addresses } from "./addresses.entity";

@Entity("Cities")
export class Cities {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  city_id!: bigint;

  @Column({ type: "varchar", length: 255 })
  city_name!: string;

  @ManyToOne(() => States, { onDelete: "CASCADE" })
  @JoinColumn({ name: "state_id" })
  state!: States;

  @OneToMany(() => Addresses, (address) => address.city)
  addresses!: Addresses[];
}
