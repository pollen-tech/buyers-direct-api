import {MigrationInterface, QueryRunner} from "typeorm";

console.log("CurrentTime to append in filename : " + Date.now());

export class CreateCompaniesTables1722135909397 implements MigrationInterface {
    name = "CreateCompaniesTables1722135909397";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

        await queryRunner.query(
            `
                CREATE TABLE company_type
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
                CREATE TABLE company
                (
                    id                uuid                  DEFAULT uuid_generate_v4() primary key,
                    account_id        integer               default 0,
                    name              varchar(100) NOT NULL default 'NA',
                    unique_name       varchar(100) NOT NULL default 'NA',
                    company_type_id   smallint              default 0,
                    country_id        int                   default 0,
                    country_name      varchar(100)          default 'NA',
                    order_volume_id   smallint              default 0,
                    order_volume_name varchar(100)          default 'NA',
                    created_at        timestamp without time zone NOT NULL DEFAULT now(),
                    updated_at        timestamp without time zone NOT NULL DEFAULT now(),
                    deleted_at        timestamp without time zone,
                    updated_on        bigint                default 0,
                    status            varchar(25)  not null DEFAULT 'NA',
                    CONSTRAINT uq_company_name UNIQUE (name),
                    CONSTRAINT fk_company_company_type_id FOREIGN KEY (company_type_id) REFERENCES company_type (id),
                    CONSTRAINT fk_company_order_volume_id FOREIGN KEY (order_volume_id) REFERENCES order_volume (id)
                );
            `,
        );
        await queryRunner.query(
            `
                CREATE TABLE company_user
                (
                    id         uuid                 DEFAULT uuid_generate_v4() primary key,
                    company_id uuid        NOT NULL,
                    user_id    uuid        NOT NULL,
                    status     varchar(25) not null DEFAULT 'NA',
                    created_at timestamp without time zone NOT NULL DEFAULT now(),
                    updated_at timestamp without time zone NOT NULL DEFAULT now(),
                    deleted_at timestamp without time zone,
                    CONSTRAINT fk_company_user_company_id FOREIGN KEY (company_id) REFERENCES company (id)
                );
            `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE company_user;`);

        await queryRunner.query(`DROP TABLE company;`);

        await queryRunner.query(`DROP TABLE company_types;`);
    }
}
