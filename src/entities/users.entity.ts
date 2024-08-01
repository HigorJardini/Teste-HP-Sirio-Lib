import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import { Addresses } from "./addresses.entity";

@Entity("Users")
export class Users {
  @PrimaryGeneratedColumn()
  user_id!: bigint;

  @Column()
  cpf!: string;

  @Column()
  name!: string;

  @Column()
  birth_date!: Date;

  @Column({ nullable: true })
  address_id!: bigint;

  @Column()
  is_active: boolean = false;

  @ManyToOne(() => Addresses, { nullable: true })
  @JoinColumn({ name: "address_id" })
  address!: Addresses | null;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date | null;
}
