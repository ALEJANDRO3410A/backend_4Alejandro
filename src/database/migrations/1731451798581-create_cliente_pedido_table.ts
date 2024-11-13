import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientePedidoTable1731451798581 implements MigrationInterface {
    name = 'CreateClientePedidoTable1731451798581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clientes" ("id" SERIAL NOT NULL, "nombre_completo" character varying NOT NULL, "dni" character varying NOT NULL, "telefono" character varying NOT NULL, CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedidos" ("id" SERIAL NOT NULL, "fecha" character varying NOT NULL, "estado" integer NOT NULL, "observaciones" character varying NOT NULL, CONSTRAINT "PK_ebb5680ed29a24efdc586846725" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pedidos"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
    }

}
