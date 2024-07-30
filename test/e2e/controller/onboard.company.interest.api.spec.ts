import { Test } from "@nestjs/testing";
import { CustomConfigModule } from "../../../src/config/config.module";
import { INestApplication } from "@nestjs/common";
import { TestDatabaseModule } from "../../config/test.database.module";
import { OnboardModule } from "../../../src/app/onboard/onboard.module";
import { CompanyTypeRepository } from "../../../src/app/onboard/repositories/company.type.repository";
import { DataRepository } from "../../config/db/data.repository";
import apiRequestTest from "supertest";
import { create_company_req_data } from "../../data/json/create_company_interest";
import { OnboardCompanyService } from "../../../src/app/onboard/domain/onboard.company.service";

describe("Controller: Onboard Company Interest API Test", () => {
  let app: INestApplication;
  let httpServer: any;
  let company_type_repo: CompanyTypeRepository;
  let company_type_entity: any;
  let onboardCompanyService: OnboardCompanyService;

  let USER_ID = "1c77da62-d6fd-40d1-ba16-353894876c45";

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [
        CustomConfigModule,
        TestDatabaseModule.forRoot(),
        OnboardModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    app = testingModule.createNestApplication();
    app.setGlobalPrefix("/api");
    await app.init();
    httpServer = app.getHttpServer();

    company_type_repo = testingModule.get<CompanyTypeRepository>(
      CompanyTypeRepository,
    );
    onboardCompanyService = testingModule.get<OnboardCompanyService>(
      OnboardCompanyService,
    );

    //* create test data * /
    company_type_entity =
      await DataRepository.createCompanyType(company_type_repo);
  });

  it("POST - /onboard-company/{company_id}/interest", async () => {
    const createNewCompanyDto = {
      name: "Fairprice",
      user_id: USER_ID,
      unique_name: "Fairprice".toLowerCase(),
      company_type_id: 1,
      operation_country_id: 1,
      operation_country_name: "Singapore",
      liquidate_unit_id: 1,
      liquidate_unit_name: "",
      logo: "'",
    };

    const savedCompany = await onboardCompanyService.onboardNewCompany({
      ...createNewCompanyDto,
      id: null,
      company_type_description: null,
    });

    const COMPANY_ID = savedCompany.id;

    const reqDto = create_company_req_data;
    let response = await apiRequestTest(httpServer)
      .post(`/api/onboard-company/${COMPANY_ID}/interest`)
      .send(reqDto)
      .set("Accept", "application/json")
      .expect((res) => {
        let res_data = res.body.data;
      });
    console.log("Response : ", response.body);
    // console.log('Response : ', savedCompany);
  });
});
