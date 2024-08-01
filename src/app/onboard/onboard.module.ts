import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardController } from './controller/onboard.controller';
import { OnboardCompanyService } from './domain/onboard.company.service';
import { CompanyTypeEntity } from './repositories/company.type.entity';
import { CompanyEntity } from './repositories/company.entity';
import { CompanyUserEntity } from './repositories/company.user.entity';
import { LiquidateUnitEntity } from './repositories/liquidate.unit.entity';
import { CompanyTypeRepository } from './repositories/company.type.repository';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyUserRepository } from './repositories/company.user.repository';
import { LiquidateUnitRepository } from './repositories/liquidate.unit.repository';
import { DatabaseModule } from '../../database/database.module';
import { CompanyInterestService } from './domain/company.interest.service';
import { ImportMarketRepository } from './repositories/import.market.repository';
import { TargetMarketRepository } from './repositories/target.market.repository';
import { CategoryRepository } from './repositories/category.repository';
import { OrderVolumeRepository } from './repositories/order.volume.repository';
import { ImportMarketEntity } from './repositories/import.market.entity';
import { TargetMarketEntity } from './repositories/target.market.entity';
import { CategoryEntity } from './repositories/category.entity';
import { OrderVolumeEntity } from './repositories/order.volume.entity';
import { InterestCategoryRepository } from './repositories/interest.category.repository';
import { InterestCategoryEntity } from './repositories/interest.category.entity';
import { CompanyOnboardNotifyService } from './domain/company.onboard.notify.service';
import {NotifyModule} from "../notify/notify.module";

let repositories: any[] = [
    CompanyTypeRepository,
    CompanyRepository,
    CompanyUserRepository,
    LiquidateUnitRepository,
    ImportMarketRepository,
    TargetMarketRepository,
    CategoryRepository,
    InterestCategoryRepository,
    OrderVolumeRepository,
];
let entities: any[] = [
    CompanyTypeEntity,
    CompanyEntity,
    CompanyUserEntity,
    LiquidateUnitEntity,
    ImportMarketEntity,
    TargetMarketEntity,
    CategoryEntity,
    InterestCategoryEntity,
    OrderVolumeEntity,
];

@Module({
    imports: [TypeOrmModule.forFeature(entities), DatabaseModule.forCustomRepository(repositories),NotifyModule],
    providers: [OnboardCompanyService, CompanyInterestService, CompanyOnboardNotifyService],
    controllers: [OnboardController],
    exports: [TypeOrmModule, OnboardCompanyService],
})
export class OnboardModule {}
