import { LiquidateUnitEntity } from './liquidate.unit.entity';

import { CustomRepository } from '../../../database/decorators/custom-repository.decorator';
import BaseRepository from '../../../database/infrastructure/repository/base.repository';
@CustomRepository(LiquidateUnitEntity)
export class LiquidateUnitRepository extends BaseRepository<LiquidateUnitEntity> {}
