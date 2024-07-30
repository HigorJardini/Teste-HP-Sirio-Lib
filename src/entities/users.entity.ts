import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Addresses } from "./addresses.entity";

@Entity("Users")
export class Users {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  user_id!: bigint;

  @Column({ type: "varchar", length: 11, unique: true })
  cpf!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "date" })
  birth_date!: Date;

  @ManyToOne(() => Addresses, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "address_id" })
  addresses?: Addresses;

  @Column({ type: "boolean" })
  is_active!: boolean;
}
