import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1786288662999 implements MigrationInterface {
  name = "InitialSchema1786288662999";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying, "googleId" character varying, "username" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "role" character varying NOT NULL DEFAULT 'ROLE_USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "upload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "userId" uuid, CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "targetUserId" character varying NOT NULL, "details" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "actorId" uuid, CONSTRAINT "PK_9425be48a9c753f5753017c61b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "FK_0acad24db01762fb1d5b51a70cd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_audit_log" ADD CONSTRAINT "FK_36bbe437f58115710cba4bf8a9f" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_audit_log" DROP CONSTRAINT "FK_36bbe437f58115710cba4bf8a9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "FK_0acad24db01762fb1d5b51a70cd"`,
    );
    await queryRunner.query(`DROP TABLE "admin_audit_log"`);
    await queryRunner.query(`DROP TABLE "upload"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
