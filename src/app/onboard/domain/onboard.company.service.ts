import { HttpStatus, Injectable } from '@nestjs/common';
import { OnboardCompanyMapper, OnboardCompanyReqDto, OnboardCompanyResDto } from '../dto/onboard.dto';
import { CompanyRepository } from '../repositories/company.repository';
import { Status } from '../../../common/enums/common.enum';
import { CompanyUserRepository } from '../repositories/company.user.repository';
import { LiquidateUnitRepository } from '../repositories/liquidate.unit.repository';
import { CompanyTypeRepository } from '../repositories/company.type.repository';
import { CompanyTypeEntity } from '../repositories/company.type.entity';
import { LiquidateUnitEntity } from '../repositories/liquidate.unit.entity';
import { CompanyEntity } from '../repositories/company.entity';
import { CompanyUserEntity } from '../repositories/company.user.entity';
import { OrderVolumeRepository } from '../repositories/order.volume.repository';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class OnboardCompanyService {
    constructor(
        private companyRepository: CompanyRepository,
        private companyTypeRepository: CompanyTypeRepository,
        private companyUserRepository: CompanyUserRepository,
        private orderVolumeRepository: OrderVolumeRepository,
        private categoryRepository: CategoryRepository,
    ) {}

    async findOneByCompanyName(company_name: string) {
        const company = await this.companyRepository.findOne({
            where: { name: company_name },
        });
        if (!company) {
            return {
                status_code: HttpStatus.NOT_FOUND.toString(),
                desc: 'Company name does not exist.',
            };
        }
        return this.createResponseDto(company, null);
    }

    async findOneByUserId(user_id: string) {
        const company_user = await this.companyUserRepository.findOne({
            where: { user_id },
        });
        if (!company_user) {
            return null;
        }
        const company = await this.companyRepository.findOne({
            where: { id: company_user.company_id },
        });
        return this.createResponseDto(company, company_user.user_id);
    }

    async findOneByCompanyId(company_id: string) {
        const company = await this.companyRepository.findOneBy({ id: company_id });
        return await this.createResponseDto(company, null);
    }

    async getOrderVolumes(): Promise<LiquidateUnitEntity[]> {
        return await this.orderVolumeRepository.find({
            where: { status: Status.ACTIVE },
        });
    }

    async getCategories(): Promise<LiquidateUnitEntity[]> {
        return await this.categoryRepository.find({
            where: { status: Status.ACTIVE },
        });
    }

    async getActiveCompanyTypes(): Promise<CompanyTypeEntity[]> {
        return await this.companyTypeRepository.find({
            where: { status: Status.ACTIVE },
        });
    }

    async onboardNewCompany(reqDto: OnboardCompanyReqDto) {
        /* create the company */
        let savedCompany = await this.createCompany(reqDto);
        /* save the company & user relation */
        await this.createCompanyUser(savedCompany.id, reqDto.user_id);
        return savedCompany;
    }

    async createCompany(reqDto: OnboardCompanyReqDto) {
        const entity = OnboardCompanyMapper.toCompanyEntity(reqDto);
        entity.account_id = await this.companyRepository.getNextAccountId();
        const saved = await this.companyRepository.save(entity);
        let resDto: OnboardCompanyResDto = {
            ...reqDto,
            account_id: saved.account_id,
            id: saved.id,
            order_volume_id: saved.order_volume_id,
            order_volume_name: saved.order_volume_name,
        };
        return resDto;
    }

    async createCompanyUser(company_id: string, user_id: string) {
        let entity = new CompanyUserEntity();
        entity.company_id = company_id;
        entity.user_id = user_id;
        return await this.companyUserRepository.save(entity);
    }

    private async createResponseDto(company, user_id) {
        const company_type = await this.companyTypeRepository.findOne({
            where: { id: company.company_type_id },
        });

        const resDto = new OnboardCompanyResDto();
        // resDto.status_code = HttpStatus.OK.toString();
        resDto.id = company.id;
        resDto.name = company.name;
        resDto.user_id = user_id;
        resDto.account_id = company.account_id;
        resDto.company_type_id = company.company_type_id;
        resDto.company_type_description = company_type.description;
        resDto.company_type_id = company.company_type_id;
        resDto.operation_country_name = company.country_name;
        resDto.operation_country_id = company.country_id;
        resDto.order_volume_id = company.order_volume_id;
        resDto.order_volume_name = company.order_volume_name;
        return resDto;
    }
}
