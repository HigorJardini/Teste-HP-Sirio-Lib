import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { City } from "./city.entity";

@Entity("Address")
export class Address {
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

  @ManyToOne(() => City, { onDelete: "CASCADE" })
  @JoinColumn({ name: "city_id" })
  city!: City;

  @Column({ type: "varchar", length: 255 })
  zip_code!: string;
}
