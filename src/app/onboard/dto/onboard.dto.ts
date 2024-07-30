import { isEmpty, IsNotEmpty } from 'class-validator';
import { CompanyEntity } from '../repositories/company.entity';
import { Optional } from '@nestjs/common';
import { Status } from '../../../common/enums/common.enum';
import { CompanyInterestService } from '../domain/company.interest.service';

export class OnboardCompanyReqDto {
    id!: string;

    @IsNotEmpty()
    name: string;

    @Optional()
    unique_name: string;

    @IsNotEmpty()
    company_type_id: number;

    @Optional()
    company_type_description: string;

    @IsNotEmpty()
    operation_country_id: number;

    @IsNotEmpty()
    operation_country_name: string;

    @Optional()
    logo: string;

    @IsNotEmpty()
    user_id: string;
}

export class OnboardCompanyResDto extends OnboardCompanyReqDto {
    id: string;
    account_id: number;
    company_type_description: string;
    order_volume_id: number;
    order_volume_name: string;
}

export class OnboardCompanyMapper {
    static toCompanyEntity(req: OnboardCompanyReqDto) {
        const entity = new CompanyEntity();
        if (req.id) {
            entity.id = req.id;
        }
        entity.name = req.name;
        entity.company_type_id = req.company_type_id;
        entity.country_id = req.operation_country_id;
        entity.country_name = req.operation_country_name;
        // entity.order_volume_id = req.order_volume_id;
        // entity.order_volume_name = req.order_volume_name;
        entity.status = Status.ACTIVE;
        if (!req.unique_name || req.unique_name.trim() === '') {
            entity.unique_name = req.name.toLowerCase();
        } else {
            entity.unique_name = req.unique_name.toLowerCase();
        }
        return entity;
    }
}

export class CompanyInterestReqDto {
    @IsNotEmpty()
    company_id: string;

    @IsNotEmpty()
    order_volume_id: number;

    @IsNotEmpty()
    interest_categories: [{ category_id: number; category_name: string }];

    @IsNotEmpty()
    import_markets: [{ country_id: number; country_name: string }];

    @IsNotEmpty()
    target_markets: [TargetMarketDto];
}

export class CompanyInterestResDto extends CompanyInterestService {
    created_status: string;
}

export class TargetMarketDto {
    country_id: number;
    country_name: string;
    cities: [{ city_id: number; city_name: number }];
}
