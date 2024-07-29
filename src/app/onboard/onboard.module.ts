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
import {DatabaseModule} from "../../database/database.module";
import {CompanyInterestService} from "./domain/company.interest.service";
import {ImportMarketRepository} from "./repositories/import.market.repository";
import {TargetMarketRepository} from "./repositories/target.market.repository";
import {CategoryRepository} from "./repositories/category.repository";
import {CompanyInterestRepository} from "./repositories/company.interest.repository";
import {OrderVolumeRepository} from "./repositories/order.volume.repository";
import {ImportMarketEntity} from "./repositories/import.market.entity";
import {TargetMarketEntity} from "./repositories/target.market.entity";
import {CategoryEntity} from "./repositories/category.entity";
import {OrderVolumeEntity} from "./repositories/order.volume.entity";

let repositories: any[] = [CompanyTypeRepository, CompanyRepository,
    CompanyUserRepository, LiquidateUnitRepository,
    ImportMarketRepository, TargetMarketRepository,CategoryRepository,CompanyInterestRepository,
    OrderVolumeRepository
];

@Module({
    imports: [
        TypeOrmModule.forFeature([CompanyTypeEntity, CompanyEntity, CompanyUserEntity, LiquidateUnitEntity,
        ImportMarketEntity,TargetMarketEntity,CategoryEntity,CompanyInterestRepository, OrderVolumeEntity]),
        DatabaseModule.forCustomRepository(repositories),
    ],
    providers: [OnboardCompanyService,CompanyInterestService],
    controllers: [OnboardController],
    exports: [TypeOrmModule, OnboardCompanyService],
})
export class OnboardModule {}
