import { CustomRepository } from '../../../database/decorators/custom-repository.decorator';
import BaseRepository from '../../../database/infrastructure/repository/base.repository';
import { CompanyTypeEntity } from './company.type.entity';

@CustomRepository(CompanyTypeEntity)
export class CompanyTypeRepository extends BaseRepository<CompanyTypeEntity> {}
