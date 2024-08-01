import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Cities } from "./cities.entity";
import { Users } from "./users.entity";

@Entity("Addresses")
export class Addresses {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  address_id!: bigint;

  @Column({ type: "text" })
  street!: string;

  @Column({ type: "varchar", length: 255 })
  house_number!: string;

  @Column({ type: "text", nullable: true })
  complement?: string;

  @Column({ type: "text", nullable: true })
  neighborhood?: string;

  @ManyToOne(() => Cities, (city) => city.addresses, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city!: Cities;

  @Column({ type: "varchar", length: 255 })
  postal_code!: string;

  @OneToMany(() => Users, (user) => user.address, { nullable: true })
  user!: Users | null;
}
