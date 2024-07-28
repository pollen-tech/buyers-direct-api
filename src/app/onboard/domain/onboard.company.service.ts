import { HttpStatus, Injectable } from '@nestjs/common';
import { OnboardCompanyMapper, OnboardCompanyReqDto, OnboardCompanyResDto } from '../dto/onboard.dto';
import { CompanyRepository } from '../repositories/company.repository';
import { Status } from '../../../common/enums/common.enum';
import { CompanyUserRepository } from '../repositories/company.user.repository';
import { LiquidateUnitRepository } from '../repositories/liquidate.unit.repository';
import { CompanyTypeRepository } from '../repositories/company.type.repository';
import { CompanyTypeEntity } from '../repositories/company.type.entity';
import { LiquidateUnitEntity } from '../repositories/liquidate.unit.entity';

@Injectable()
export class OnboardCompanyService {
    constructor(
        private companyRepository: CompanyRepository,
        private companyTypeRepository: CompanyTypeRepository,
        private companyUserRepository: CompanyUserRepository,
        private liquidateUnitRepository: LiquidateUnitRepository,
    ) {}

    async findOneByCompanyName(company_name: string) {
        const company = await this.companyRepository.findOne({ where: { name: company_name } });
        if (!company) {
            return {
                status_code: HttpStatus.NOT_FOUND.toString(),
                desc: 'Company name does not exist.',
            };
        }
        return this.createResponseDto(company, null);
    }

    async findOneByUserId(user_id: string) {
        const company_user = await this.companyUserRepository.findOne({ where: { user_id } });
        if (!company_user) {
            return {
                status_code: HttpStatus.NOT_FOUND.toString(),
                desc: 'User does not exist',
            };
        }
        const company = await this.companyRepository.findOne({ where: { id: company_user.company_id } });
        return this.createResponseDto(company, company_user.user_id);
    }

    async getActiveLiquidateUnits(): Promise<LiquidateUnitEntity[]> {
        return await this.liquidateUnitRepository.find({ where: { status: Status.ACTIVE } });
    }

    async getActiveCompanyTypes(): Promise<CompanyTypeEntity[]> {
        return await this.companyTypeRepository.find({ where: { status: Status.ACTIVE } });
    }

    async onboardNewCompany(reqDto: OnboardCompanyReqDto) {
        let savedCompany = await this.createCompany(reqDto);
        await this.createCompanyUser(savedCompany.id, reqDto.user_id);
        return savedCompany;
    }

    async createCompany(reqDto: OnboardCompanyReqDto) {
        const entity = OnboardCompanyMapper.toCompanyEntity(reqDto);
        entity.account_id = await this.companyRepository.getNextAccountId();
        const saved = await this.companyRepository.save(entity);
        let res = { ...reqDto };
        res.id = saved.id;
        return res;
    }

    async createCompanyUser(company_id: string, user_id: string) {
        let entity = { status: Status.ACTIVE, company_id, user_id };
        return await this.companyUserRepository.save(entity);
    }

    private async createResponseDto(company, user_id) {
        const company_type = await this.companyTypeRepository.findOne({ where: { id: company.company_type_id } });
        const liquidation = await this.liquidateUnitRepository.findOne({ where: { id: company.liquidate_unit_id } });

        const resDto = new OnboardCompanyResDto();
        resDto.status_code = HttpStatus.OK.toString();
        resDto.id = company.id;
        resDto.name = company.name;
        resDto.user_id = user_id;
        resDto.account_id = company.account_id;
        resDto.company_type_id = company.company_type_id;
        resDto.company_type_description = company_type.description;
        resDto.company_type_id = company.company_type_id;
        resDto.liquidate_unit_id = company.liquidate_unit_id;
        resDto.liquidate_unit_name = liquidation.name;
        return resDto;
    }
}
