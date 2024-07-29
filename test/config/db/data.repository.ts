import {CompanyTypeRepository} from "../../../src/app/onboard/repositories/company.type.repository";
import {CompanyTypeEntity} from "../../../src/app/onboard/repositories/company.type.entity";
import {Status} from "../../../src/common/enums/common.enum";

export class DataRepository {


    static async createCompanyType(repo: CompanyTypeRepository) {
        const entity = new CompanyTypeEntity();
        entity.id = 1;
        entity.name = 'Clothing';
        entity.description = 'Cotton On';
        entity.status = Status.ACTIVE;
        return await repo.save(entity);
    }

}