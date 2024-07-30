import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Address } from "./address.entity";

@Entity("Users")
export class User {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  user_id!: bigint;

  @Column({ type: "varchar", length: 11, unique: true })
  cpf!: string;

  @Column({ type: "varchar", length: 255 })
  nome!: string;

  @Column({ type: "date" })
  birth_date!: Date;

  @ManyToOne(() => Address, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "address_id" })
  address?: Address;

  @Column({ type: "boolean" })
  active!: boolean;
}
