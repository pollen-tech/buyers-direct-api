import {CompanyUserEntity} from './company.user.entity';
import {CustomRepository} from "../../../database/decorators/custom-repository.decorator";
import BaseRepository from "../../../database/infrastructure/repository/base.repository";

@CustomRepository(CompanyUserEntity)
export class CompanyUserRepository extends BaseRepository<CompanyUserEntity> {
}
