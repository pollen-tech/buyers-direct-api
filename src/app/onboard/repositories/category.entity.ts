import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../../../common/enums/common.enum';

@Entity('category')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    description: string;

    @Column({ type: 'varchar' })
    status: Status;

    @BeforeInsert()
    beforeCreateOrUpdate() {
        this.status = Status.ACTIVE;
    }
}
