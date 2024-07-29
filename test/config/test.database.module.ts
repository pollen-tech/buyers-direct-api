import {DynamicModule, Logger} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DatabaseHealthcheckService} from '../../src/database/database-healthcheck.service';
import {CustomConfigModule} from '../../src/config/config.module';
import {TerminusModule} from '@nestjs/terminus';
import {CompanyEntity} from "../../src/app/onboard/repositories/company.entity";
import {CompanyTypeEntity} from "../../src/app/onboard/repositories/company.type.entity";
import {CompanyUserEntity} from "../../src/app/onboard/repositories/company.user.entity";
import {LiquidateUnitEntity} from "../../src/app/onboard/repositories/liquidate.unit.entity";
import {ImportMarketEntity} from "../../src/app/onboard/repositories/import.market.entity";
import {TargetMarketEntity} from "../../src/app/onboard/repositories/target.market.entity";
import {CategoryEntity} from "../../src/app/onboard/repositories/category.entity";
import {CompanyInterestRepository} from "../../src/app/onboard/repositories/company.interest.repository";
import {OrderVolumeEntity} from "../../src/app/onboard/repositories/order.volume.entity";

const DB_HOST: string = 'localhost';
const DB_PORT: number = 5460;
const DB_NAME = 'direct_db';
const DB_USERNAME = 'directuser';
const DB_PASSWORD = 'password334';

const entitiesList = [CompanyTypeEntity, CompanyEntity, CompanyUserEntity, LiquidateUnitEntity,
    ImportMarketEntity,TargetMarketEntity,CategoryEntity,CompanyInterestRepository, OrderVolumeEntity];

/**
 * Handle Database connection.
 */
export class TestDatabaseModule {

    static migrationConfig() {
        return {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USERNAME,
            password: DB_PASSWORD,
            db: DB_NAME,
        }
    }

    static forRoot(): DynamicModule {
        const providers = [DatabaseHealthcheckService];
        return {
            imports: [CustomConfigModule, TerminusModule, this.forConnection()],
            providers,
            global: true,
            module: TestDatabaseModule,
            exports: providers,
        };
    }

    /**
     * Look at local-docker-compose file for databases
     */
    static forConnection(): DynamicModule {


        Logger.log('entities : ' + entitiesList.map((item) => item.name));
        Logger.log('When error is EntityMetadataNotFound: No metadata, it means entity name needs to add in entitiesList, TestDBProviderModule');

        return TypeOrmModule.forRoot({
            type: 'postgres',
            host: DB_HOST,
            port: DB_PORT,
            database: DB_NAME,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            entities: entitiesList,
            synchronize: true, // for DEV/TEST only
            dropSchema: true, // NOTE - Only for TEST (it drops schema for testing and creates again)
            keepConnectionAlive: true,
            logging: false, // true when want print sql
        });
    }
}
