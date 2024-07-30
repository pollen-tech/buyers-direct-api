import { CustomRepository } from '../../../database/decorators/custom-repository.decorator';
import BaseRepository from '../../../database/infrastructure/repository/base.repository';
import { TargetMarketEntity } from './target.market.entity';

@CustomRepository(TargetMarketEntity)
export class TargetMarketRepository extends BaseRepository<TargetMarketEntity> {}
