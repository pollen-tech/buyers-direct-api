import { Injectable } from '@nestjs/common';
import { CompanyInterestReqDto, CompanyInterestResDto } from '../dto/onboard.dto';
import { CompanyRepository } from '../repositories/company.repository';
import { ImportMarketRepository } from '../repositories/import.market.repository';
import { TargetMarketRepository } from '../repositories/target.market.repository';
import { ImportMarketEntity } from '../repositories/import.market.entity';
import { TargetMarketEntity } from '../repositories/target.market.entity';
import { InterestCategoryRepository } from '../repositories/interest.category.repository';
import { InterestCategoryEntity } from '../repositories/interest.category.entity';

@Injectable()
export class CompanyInterestService {
    constructor(
        private importMarketRepository: ImportMarketRepository,
        private targetMarketRepository: TargetMarketRepository,
        private companyRepository: CompanyRepository,
        private interestCategoryRepository: InterestCategoryRepository,
    ) {}

    async createCompanyInterest(reqDto: CompanyInterestReqDto) {
        // save all selected category
        const savedCategoriesPromise = this.saveInterestCategory(reqDto.company_id, reqDto.interest_categories);

        // save or update import market
        const savedImportMarketsPromise = this.saveImportMarkets(reqDto.company_id, reqDto.import_markets);

        // save or update target market
        const savedTargetMarketsPromise = this.saveTargetMarkets(reqDto.company_id, reqDto.target_markets);

        // save volume
        const savedVolumePromise = this.saveOrderVolume(reqDto.company_id, reqDto.order_volume_id);

        const [savedCategories, savedImportMarkets, savedTargetMarkets, savedVolume] = await Promise.all([
            savedCategoriesPromise,
            savedImportMarketsPromise,
            savedTargetMarketsPromise,
            savedVolumePromise,
        ]);

        let data: CompanyInterestResDto | any = {};
        if (savedCategories) {
            data = { ...reqDto };
            data.created_status = 'CREATED';
        } else {
            data = { ...reqDto };
            data.created_status = 'FAILED';
        }
        return data;
    }

    private async saveOrderVolume(company_id: string, order_volume_id: number) {
        let savedCompany = await this.companyRepository.findOneBy({
            id: company_id,
        });
        if (savedCompany) {
            savedCompany.order_volume_id = order_volume_id;
        }
        return await this.companyRepository.save(savedCompany);
    }

    private async saveImportMarkets(company_id: string, import_markets: ImportMarketEntity[] | any[]) {
        let import_market_entities: ImportMarketEntity[] = [];
        import_markets.forEach((market_dto) => {
            const { country_name, country_id } = market_dto;
            let entity = new ImportMarketEntity();
            entity.company_id = company_id;
            entity.country_name = country_name;
            entity.country_id = country_id;
            import_market_entities.push(entity);
        });
        await this.importMarketRepository.delete({ company_id: company_id });
        return await this.importMarketRepository.save(import_market_entities);
    }

    private async saveTargetMarkets(company_id: string, target_markets: TargetMarketEntity[] | any[]) {
        let market_entities: TargetMarketEntity[] = [];
        target_markets.forEach((market_dto) => {
            const { country_name, country_id, cities } = market_dto;
            let entity = new TargetMarketEntity();
            entity.company_id = company_id;
            entity.country_name = country_name;
            entity.country_id = country_id;
            entity.cities = JSON.stringify(cities);
            market_entities.push(entity);
        });
        await this.targetMarketRepository.delete({ company_id: company_id });
        return await this.targetMarketRepository.save(market_entities);
    }

    private async saveInterestCategory(company_id: string, interest_categories: any[]) {
        let entities: InterestCategoryEntity[] = [];
        interest_categories.forEach((dto) => {
            const { category_id, category_name } = dto;
            let entity = new InterestCategoryEntity();
            entity.company_id = company_id;
            entity.category_id = category_id;
            entity.category_name = category_name;
            entities.push(entity);
        });
        await this.interestCategoryRepository.delete({ company_id: company_id });
        return await this.interestCategoryRepository.save(entities);
    }
}
