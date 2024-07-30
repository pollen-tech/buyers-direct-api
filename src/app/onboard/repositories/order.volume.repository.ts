import { CustomRepository } from '../../../database/decorators/custom-repository.decorator';
import BaseRepository from '../../../database/infrastructure/repository/base.repository';
import { CategoryEntity } from './category.entity';
import { OrderVolumeEntity } from './order.volume.entity';

@CustomRepository(OrderVolumeEntity)
export class OrderVolumeRepository extends BaseRepository<OrderVolumeEntity> {}
