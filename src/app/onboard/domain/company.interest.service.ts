import {HttpStatus, Injectable} from '@nestjs/common';
import {
    CompanyInterestReqDto,
    OnboardCompanyMapper,
    OnboardCompanyReqDto,
    OnboardCompanyResDto
} from '../dto/onboard.dto';
import {CompanyRepository} from '../repositories/company.repository';
import {Status} from '../../../common/enums/common.enum';
import {CompanyUserRepository} from '../repositories/company.user.repository';
import {LiquidateUnitRepository} from '../repositories/liquidate.unit.repository';
import {CompanyTypeRepository} from '../repositories/company.type.repository';
import {CompanyTypeEntity} from '../repositories/company.type.entity';
import {LiquidateUnitEntity} from '../repositories/liquidate.unit.entity';
import {CompanyEntity} from "../repositories/company.entity";
import {CompanyUserEntity} from "../repositories/company.user.entity";
import {ImportMarketRepository} from "../repositories/import.market.repository";
import {TargetMarketRepository} from "../repositories/target.market.repository";
import {OrderVolumeRepository} from "../repositories/order.volume.repository";
import {ImportMarketEntity} from "../repositories/import.market.entity";

@Injectable()
export class CompanyInterestService {
    constructor(
        private importMarketRepository: ImportMarketRepository,
        private targetMarketRepository: TargetMarketRepository,
        private orderVolumeRepository: OrderVolumeRepository,
        private liquidateUnitRepository: LiquidateUnitRepository,
    ) {
    }


    async createCompanyInterest(reqDto: CompanyInterestReqDto) {

        // save all selected category

        // save or update import market
        await this.saveImportMarkets(reqDto.company_id, reqDto.import_markets);

        // save or update target market

        // save volume
        return reqDto;
    }


    private async saveImportMarkets(company_id: string, import_markets: ImportMarketEntity[] | any[]) {
        let import_market_entities: ImportMarketEntity[] = [];
        import_markets.forEach(market_dto => {
            const {country_name, country_id} = market_dto;
            let entity = new ImportMarketEntity();
            entity.company_id = company_id;
            entity.country_name = country_name;
            entity.country_id = country_id;
            import_market_entities.push(entity);
        })
        return await this.importMarketRepository.save(import_market_entities);
    }
}
