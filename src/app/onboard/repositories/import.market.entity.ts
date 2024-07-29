import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Status} from '../../../common/enums/common.enum';

@Entity('import_market')
export class ImportMarketEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: 'uuid'})
    company_id: string;

    @Column({type: 'int'})
    country_id: number;

    @Column({type: 'varchar'})
    country_name: string;

    @Column({type: 'varchar'})
    status: Status;

    @CreateDateColumn({type: 'timestamptz'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updated_at: Date;

    @Column({type: 'timestamptz', nullable: true})
    deleted_at: Date;

    @Column({type: 'bigint' })
    updated_on: number;

    @BeforeInsert()
    @BeforeUpdate()
    beforeCreateOrUpdate() {
        this.updated_on = Date.now();
    }

    @BeforeInsert()
    beforeInsert() {
        this.status = Status.ACTIVE;
    }
}
