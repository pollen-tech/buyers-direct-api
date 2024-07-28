import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('company_type')
export class CompanyTypeEntity {
    @PrimaryColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    description: string;

    @Column({ type: 'varchar' })
    status: string;
}
