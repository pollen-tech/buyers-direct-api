import { CustomRepository } from '../../../database/decorators/custom-repository.decorator';
import BaseRepository from '../../../database/infrastructure/repository/base.repository';
import { ImportMarketEntity } from './import.market.entity';

@CustomRepository(ImportMarketEntity)
export class ImportMarketRepository extends BaseRepository<ImportMarketEntity> {}
