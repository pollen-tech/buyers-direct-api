import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../repositories/company.repository';
import { CompanyTypeRepository } from '../repositories/company.type.repository';
import { InterestCategoryRepository } from '../repositories/interest.category.repository';
import { TargetMarketRepository } from '../repositories/target.market.repository';
import { ImportMarketRepository } from '../repositories/import.market.repository';
import { UserDto } from '../../../common/dtos/user.dto';

@Injectable()
export class CompanyOnboardNotifyService {
    constructor(
        private companyRepository: CompanyRepository,
        private companyTypeRepository: CompanyTypeRepository,
        private interestCategoryRepository: InterestCategoryRepository,
        private targetMarketRepository: TargetMarketRepository,
        private importMarketRepository: ImportMarketRepository,
    ) {}

    async notifyAdmin(company_id: string, user: UserDto) {
        const company = await this.companyRepository.findOneBy({ id: company_id });
        const company_type = await this.companyTypeRepository.findById(company.company_type_id);
        const targetMarketEntities = await this.targetMarketRepository.findBy({ company_id: company_id });

        const importMarkets = await this.importMarketRepository.findBy({ company_id: company_id }).then((results) => {
            return results.map((market) => market.country_name).join(', ');
        });

        const interest_categories = await this.interestCategoryRepository
            .findBy({ company_id: company_id })
            .then((results) => results.map((result) => result.category_name).join(','));

        const target_countries = targetMarketEntities.map((market) => market.country_name).join(', ');
        const target_cities = targetMarketEntities
            .map((market) => {
                const cities_array = JSON.parse(market.cities);
                return cities_array.map((item) => item.city_name).join(',');
            })
            .join(',');

        const dto = this.createDto(company, company_type, user, interest_categories, target_countries, target_cities);

        console.log('Notify DTO', dto);
    }

    private createDto(company, company_type, user: UserDto, interest_categories, target_countries, target_cities) {
        return {
            companyName: company.name,
            companyType: company_type.name,
            companyLocation: company.country_name,
            contactCategoryOfInterest: interest_categories,
            contactTargetResaleMarketCountries: target_countries,
            contactTargetResaleMarketCities: target_cities,
            monthlyOrderVolume: company.order_volume_name,
            contactName: user.first_name,
            contactEmail: user.email,
            contactPhoneNumber: '+' + user.country_code + user.phone_no,
            adminLink: 'https://admin-dev.pollen.tech',
        };
    }
}
