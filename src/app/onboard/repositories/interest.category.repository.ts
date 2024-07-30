import { CustomRepository } from "../../../database/decorators/custom-repository.decorator";
import BaseRepository from "../../../database/infrastructure/repository/base.repository";
import { InterestCategoryEntity } from "./interest.category.entity";

@CustomRepository(InterestCategoryEntity)
export class InterestCategoryRepository extends BaseRepository<InterestCategoryEntity> {}
