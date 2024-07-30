import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Status } from "../../../common/enums/common.enum";

@Entity("company")
export class CompanyEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", default: 0 })
  account_id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  unique_name: string;

  @Column({ type: "int" })
  company_type_id: number;

  @Column({ type: "int" })
  country_id: number;

  @Column({ type: "varchar" })
  country_name: string;

  @Column({ type: "int", default: 0 })
  order_volume_id: number;

  @Column({ type: "varchar", default: "NA" })
  order_volume_name: string;

  @Column({ type: "varchar" })
  status: Status;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @Column({ type: "bigint" })
  updated_on: number;

  @BeforeInsert()
  @BeforeUpdate()
  beforeCreateOrUpdate() {
    this.updated_on = Date.now();
  }

  @BeforeInsert()
  beforeCreate() {
    this.status = Status.ACTIVE;
  }
}
