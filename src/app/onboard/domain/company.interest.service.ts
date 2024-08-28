import { Injectable } from '@nestjs/common';
import { CompanyInterestProfileDto, CompanyInterestReqDto, CompanyInterestResDto } from '../dto/onboard.dto';
import { CompanyRepository } from '../repositories/company.repository';
import { ImportMarketRepository } from '../repositories/import.market.repository';
import { TargetMarketRepository } from '../repositories/target.market.repository';
import { ImportMarketEntity } from '../repositories/import.market.entity';
import { TargetMarketEntity } from '../repositories/target.market.entity';
import { InterestCategoryRepository } from '../repositories/interest.category.repository';
import { InterestCategoryEntity } from '../repositories/interest.category.entity';
import { OnboardCompanyService } from './onboard.company.service';

@Injectable()
export class CompanyInterestService {
    constructor(
        private importMarketRepository: ImportMarketRepository,
        private targetMarketRepository: TargetMarketRepository,
        private companyRepository: CompanyRepository,
        private interestCategoryRepository: InterestCategoryRepository,
        private onboardCompanyService: OnboardCompanyService,
    ) {}

    async getCompanyInterest(company_id: string) {
        const saved_company_promise = this.onboardCompanyService.findOneByCompanyId(company_id);
        const saved_import_market_promise = this.findImportMarket(company_id);
        const saved_target_market_promise = this.findTargetMarket(company_id);
        const saved_categories_promise = this.findCategories(company_id);

        const [company, imports, targets, categories] = await Promise.all([
            saved_company_promise,
            saved_import_market_promise,
            saved_target_market_promise,
            saved_categories_promise,
        ]);
        let profileDto: CompanyInterestProfileDto = {
            ...company,
            company_id: company_id,
            interest_categories: categories,
            import_markets: imports,
            target_markets: targets,
        };
        return profileDto;
    }

    private async findCategories(company_id: string) {
        let categories = [];
        const saved_categories = await this.interestCategoryRepository.findBy({ company_id: company_id });
        saved_categories.forEach((entity) => {
            categories.push({
                category_id: entity.category_id,
                category_name: entity.category_name,
            });
        });
        return categories;
    }

    private async findTargetMarket(company_id: string) {
        let dtos = [];
        const entities = await this.targetMarketRepository.findBy({ company_id: company_id });
        entities.forEach((entity) => {
            dtos.push({
                country_id: entity.country_id,
                country_name: entity.country_name,
                cities: JSON.parse(entity.cities),
            });
        });
        return dtos;
    }

    private async findImportMarket(company_id: string) {
        let dtos = [];
        const entities = await this.importMarketRepository.findBy({ company_id: company_id });
        entities.forEach((entity) => {
            dtos.push({ country_id: entity.country_id, country_name: entity.country_name });
        });
        return dtos;
    }

    async createCompanyInterest(reqDto: CompanyInterestReqDto) {
        // save all selected category
        const savedCategoriesPromise = this.saveInterestCategory(reqDto.company_id, reqDto.interest_categories);

        // save or update import market
        const savedImportMarketsPromise = this.saveImportMarkets(reqDto.company_id, reqDto.import_markets);

        // save or update target market
        const savedTargetMarketsPromise = this.saveTargetMarkets(reqDto.company_id, reqDto.target_markets);

        // save volume
        const savedVolumePromise = this.saveOrderVolume(reqDto.company_id, reqDto.order_volume_id,reqDto.order_volume_name);

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

    private async saveOrderVolume(company_id: string, order_volume_id: number,order_volume_name: string) {
        let savedCompany = await this.companyRepository.findOneBy({
            id: company_id,
        });
        if (savedCompany) {
            savedCompany.order_volume_id = order_volume_id;
            savedCompany.order_volume_name = order_volume_name;
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
