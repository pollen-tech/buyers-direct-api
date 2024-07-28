import {Test} from '@nestjs/testing';
import {CustomConfigModule} from '../../../src/config/config.module';
import {HttpStatus, INestApplication} from '@nestjs/common';
import {TestDatabaseModule} from '../../config/test.database.module';
import {OnboardModule} from '../../../src/app/onboard/onboard.module';
import {CompanyTypeRepository} from "../../../src/app/onboard/repositories/company.type.repository";
import {DataRepository} from "../../config/db/data.repository";
import {OnboardCompanyReqDto} from "../../../src/app/onboard/dto/onboard.dto";
import apiRequestTest from "supertest";

describe('Controller: Onboard Company API Test', () => {
    let app: INestApplication;
    let httpServer: any;
    let company_type_repo: CompanyTypeRepository;
    let company_type_entity: any;

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

        //* create test data * /
        company_type_entity = await DataRepository.createCompanyType(company_type_repo);
    });


    it('POST - /onboard-company', async () => {
        const reqDto = {
            name: "Fairprice",
            user_id: "1c77da62-d6fd-40d1-ba16-353894876c45",
            unique_name: "Fairprice".toLowerCase(),
            company_type_id: 1,
            operation_country_id: 1,
            operation_country_name: 'Singapore',
            liquidate_unit_id: 1,
            liquidate_unit_name: '',
            logo: "'",
        };

        let response = await apiRequestTest(httpServer)
            .post('/api/onboard-company')
            .send(reqDto)
            .set('Accept', 'application/json')
            .expect(201)
            .expect((res) => {
                expect(res.body.status_code).toBe('CREATED');
            });

        console.log('Response', response.body);


    });
});
