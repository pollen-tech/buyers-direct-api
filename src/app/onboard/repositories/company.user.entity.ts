import {Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Status} from "../../../common/enums/common.enum";

@Entity('company_user')
export class CompanyUserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    company_id: string;

    @Column({type: 'uuid'})
    user_id: string;

    @Column({type: 'varchar'})
    status: string;

    @CreateDateColumn({type: 'timestamptz'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updated_at: Date;

    constructor() {
        this.status = Status.ACTIVE;
    }
}
