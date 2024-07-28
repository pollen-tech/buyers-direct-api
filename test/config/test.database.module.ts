import {DynamicModule, Logger} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DatabaseHealthcheckService} from '../../src/database/database-healthcheck.service';
import {CustomConfigModule} from '../../src/config/config.module';
import {TerminusModule} from '@nestjs/terminus';

const DB_HOST: string = 'localhost';
const DB_PORT: number = 5455;
const DB_NAME = 'liquid_db';
const DB_USERNAME = 'liquiduser';
const DB_PASSWORD = 'password334';


const entitiesList = [];

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
            logging: true, // true when want print sql
        });
    }
}
