import { CompanyEntity } from "./company.entity";
import { CustomRepository } from "../../../database/decorators/custom-repository.decorator";
import BaseRepository from "../../../database/infrastructure/repository/base.repository";

@CustomRepository(CompanyEntity)
export class CompanyRepository extends BaseRepository<CompanyEntity> {
  async getNextAccountId() {
    const qb = this.createQueryBuilder(this.metadata.givenTableName);
    const data = await qb
      .select("coalesce(max(account_id)+1,1000)", "next_account_id")
      .getRawOne<any>();
    return data.next_account_id;
  }
}
