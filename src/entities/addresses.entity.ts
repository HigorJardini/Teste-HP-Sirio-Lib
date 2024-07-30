import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Cities } from "./cities.entity";

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

  @ManyToOne(() => Cities, { onDelete: "CASCADE" })
  @JoinColumn({ name: "city_id" })
  city!: Cities;

  @Column({ type: "varchar", length: 255 })
  zip_code!: string;
}
