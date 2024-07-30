import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../../../common/enums/common.enum";

@Entity("order_volume")
export class OrderVolumeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  unit: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "varchar" })
  status: Status;

  @BeforeInsert()
  beforeCreateOrUpdate() {
    this.status = Status.ACTIVE;
  }
}
