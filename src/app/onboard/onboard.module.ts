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

let repositories: any[] = [CompanyTypeRepository, CompanyRepository, CompanyUserRepository, LiquidateUnitRepository];

@Module({
    imports: [
        TypeOrmModule.forFeature([CompanyTypeEntity, CompanyEntity, CompanyUserEntity, LiquidateUnitEntity]),
        DatabaseModule.forCustomRepository(repositories),
    ],
    providers: [OnboardCompanyService],
    controllers: [OnboardController],
    exports: [TypeOrmModule, OnboardCompanyService],
})
export class OnboardModule {}
