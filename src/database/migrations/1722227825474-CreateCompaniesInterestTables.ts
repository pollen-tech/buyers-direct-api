import {MigrationInterface, QueryRunner} from 'typeorm';

console.log('CurrentTime to append in filename : ' + Date.now());

export class CreateCompaniesInterestTables1722227825474 implements MigrationInterface {

    name = 'CreateCompaniesInterestTables1722227825474';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(
            `
                CREATE TABLE category
                (
                    id          smallint primary key,
                    name        varchar(100) NOT NULL,
                    description varchar(250) NOT NULL,
                    status      varchar(25)  not null DEFAULT 'NA'
                );
            `,
        );

        await queryRunner.query(
            `
                CREATE TABLE order_volume
                (
                    id          smallint primary key,
                    unit        varchar(100) NOT NULL,
                    name        varchar(100) NOT NULL,
                    description varchar(250) NOT NULL,
                    status      varchar(25)  not null DEFAULT 'NA'
                );
            `,
        );

        await queryRunner.query(
            `
                CREATE TABLE import_market
                (
                    id           uuid                  DEFAULT uuid_generate_v4() primary key,
                    company_id   uuid         NOT NULL,
                    country_id   integer               default 0,
                    country_name varchar(100) NOT NULL default 'NA',
                    created_at   timestamp without time zone NOT NULL DEFAULT now(),
                    updated_at   timestamp without time zone NOT NULL DEFAULT now(),
                    deleted_at   timestamp without time zone,
                    updated_on   bigint                default 0,
                    status       varchar(25)  not null DEFAULT 'NA',
                    CONSTRAINT fk_import_market_company_id FOREIGN KEY (company_id) REFERENCES company (id)
                );
                CREATE INDEX IF NOT EXISTS idx_import_market_company_id ON import_market(company_id);
                CREATE INDEX IF NOT EXISTS idx_import_market_country_id ON import_market(country_id);
            `,
        );

        await queryRunner.query(
            `
                CREATE TABLE target_market
                (
                    id           uuid                  DEFAULT uuid_generate_v4() primary key,
                    company_id   uuid         NOT NULL,
                    country_id   integer               default 0,
                    country_name varchar(100) NOT NULL default 'NA',
                    cities       text                  default 'NA',
                    created_at   timestamp without time zone NOT NULL DEFAULT now(),
                    updated_at   timestamp without time zone NOT NULL DEFAULT now(),
                    deleted_at   timestamp without time zone,
                    updated_on   bigint                default 0,
                    status       varchar(25)  not null DEFAULT 'NA',
                    CONSTRAINT fk_resale_market_company_id FOREIGN KEY (company_id) REFERENCES company (id)
                );
                CREATE INDEX IF NOT EXISTS idx_target_market_company_id ON target_market(company_id);
                CREATE INDEX IF NOT EXISTS idx_target_market_country_id ON target_market(country_id);
            `,
        );

        await queryRunner.query(
            `
                CREATE TABLE company_interest
                (
                    id              uuid                 DEFAULT uuid_generate_v4() primary key,
                    company_id      uuid        NOT NULL,
                    category_id     integer              default 0,
                    order_volume_id integer              default 0,
                    created_at      timestamp without time zone NOT NULL DEFAULT now(),
                    updated_at      timestamp without time zone NOT NULL DEFAULT now(),
                    deleted_at      timestamp without time zone,
                    updated_on      bigint               default 0,
                    status          varchar(25) not null DEFAULT 'NA',
                    CONSTRAINT fk_company_interest_category_id FOREIGN KEY (category_id) REFERENCES category (id),
                    CONSTRAINT fk_company_interest_order_volume_id FOREIGN KEY (order_volume_id) REFERENCES order_volume (id)
                );
                CREATE INDEX IF NOT EXISTS idx_company_interest_company_id ON company_interest(company_id);
            `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE company_interest;`);
    }
}
