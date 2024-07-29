import {IsNotEmpty} from 'class-validator';
import {CompanyEntity} from '../repositories/company.entity';
import {Optional} from '@nestjs/common';
import {Status} from '../../../common/enums/common.enum';

export class OnboardCompanyReqDto {

    id: string;

    @IsNotEmpty()
    name: string;

    @Optional()
    unique_name: string;

    @IsNotEmpty()
    company_type_id: number;

    @Optional()
    company_type_description:string

    @IsNotEmpty()
    operation_country_id: number;

    @Optional()
    operation_country_name: string;

    @IsNotEmpty()
    liquidate_unit_id: number;

    @Optional()
    liquidate_unit_name: string;

    @Optional()
    logo: string;

    user_id: string;
}

export class OnboardCompanyResDto extends OnboardCompanyReqDto {
    id: string;
    account_id: number;
    company_type_description: string;
}

export class OnboardCompanyMapper {
    static toCompanyEntity(req: OnboardCompanyReqDto) {
        const entity = new CompanyEntity();
        entity.id = req.id;
        entity.name = req.name;
        entity.company_type_id = req.company_type_id;
        entity.country_id = req.operation_country_id;
        entity.country_name = req.operation_country_name;
        entity.liquidate_unit_id = req.liquidate_unit_id;
        entity.status = Status.ACTIVE;
        if (!req.unique_name || req.unique_name.trim() === '') {
            entity.unique_name = req.name.toLowerCase()
        }else{
            entity.unique_name = req.unique_name.toLowerCase()
        }
        return entity;
    }
}
