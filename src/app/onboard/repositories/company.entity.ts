import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Status } from '../../../common/enums/common.enum';

@Entity('company')
export class CompanyEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'int' })
    account_id: number;


    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'int' })
    company_type_id: number;

    @Column({ type: 'int' })
    country_id: number;

    @Column({ type: 'int' })
    liquidate_unit_id: number;

    @Column({ type: 'varchar' })
    status: Status;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
