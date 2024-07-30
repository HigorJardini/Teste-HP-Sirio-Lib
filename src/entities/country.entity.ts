import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Country")
export class Country {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  country_id!: bigint;

  @Column({ type: "varchar", length: 255 })
  country_name!: string;
}
