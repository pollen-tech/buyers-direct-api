import { Test } from '@nestjs/testing';
import { CustomConfigModule } from '../../../src/config/config.module';
import { INestApplication } from '@nestjs/common';
import { TestDatabaseModule } from '../../config/test.database.module';
import { OnboardModule } from '../../../src/app/onboard/onboard.module';
import {CompanyTypeRepository} from "../../../src/app/onboard/repositories/company.type.repository";
import {DataRepository} from "../../config/db/data.repository";

describe('Controller: Onboard Company API Test', () => {
    let app: INestApplication;
    let httpServer: any;
    let company_type_repo: CompanyTypeRepository  ;

    beforeAll(async () => {
        const testingModule = await Test.createTestingModule({
            imports: [CustomConfigModule, TestDatabaseModule.forRoot(), OnboardModule],
            controllers: [],
            providers: [],
        }).compile();

        app = testingModule.createNestApplication();
        app.setGlobalPrefix('/api');
        await app.init();
        httpServer = app.getHttpServer();

        company_type_repo = testingModule.get<CompanyTypeRepository>(CompanyTypeRepository);
    });

    beforeEach(async () => {
        await DataRepository.createCompanyType(company_type_repo);
    });


    it('POST - /onboard-company', async () => {
        console.log("test");
    });
});
