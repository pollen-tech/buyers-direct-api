import {CustomRepository} from "../../../database/decorators/custom-repository.decorator";
import BaseRepository from "../../../database/infrastructure/repository/base.repository";
import {CompanyInterestEntity} from "./company.interest.entity";

@CustomRepository(CompanyInterestEntity)
export class CompanyInterestRepository extends BaseRepository<CompanyInterestEntity>{
}
