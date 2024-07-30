import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Status } from '../../../common/enums/common.enum';

@Entity('interest_category')
export class InterestCategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    company_id: string;

    @Column({ type: 'int', default: 0 })
    category_id: number;

    @Column({ type: 'varchar' })
    category_name: string;

    @Column({ type: 'varchar' })
    status: Status;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column({ type: 'bigint' })
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
