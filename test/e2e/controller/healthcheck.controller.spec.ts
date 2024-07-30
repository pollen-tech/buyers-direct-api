import { Test, TestingModule } from '@nestjs/testing';
import { HealthcheckModule } from '../../../src/app/healthcheck/healthcheck.module';
import { CustomConfigModule } from '../../../src/config/config.module';
import { HealthcheckController } from '../../../src/app/healthcheck/controllers/healthcheck.controller';
import { TestDatabaseModule } from '../../config/test.database.module';

describe('Controller: Healthcheck Test', () => {
    let testingModule: TestingModule;
    let healthCheckController: any;

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            // imports: [CustomConfigModule, DatabaseModule.forRoot(), HealthcheckModule],
            imports: [CustomConfigModule, TestDatabaseModule.forRoot(), HealthcheckModule],
            controllers: [],
            providers: [],
        }).compile();
        healthCheckController = testingModule.get<HealthcheckController>(HealthcheckController);
    });

    describe('fn:check =>', () => {
        it('Should return Pending"', async () => {
            const response = await healthCheckController.check();
            console.log('response', response);
        });
    });
});
