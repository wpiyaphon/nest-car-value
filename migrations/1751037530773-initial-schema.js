/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class InitialSchema1751037530773 {
    name = 'InitialSchema1751037530773'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "mileage" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "temporary_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "mileage" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "userId" integer, CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_report"("id", "approved", "price", "make", "model", "year", "mileage", "lng", "lat", "userId") SELECT "id", "approved", "price", "make", "model", "year", "mileage", "lng", "lat", "userId" FROM "report"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`ALTER TABLE "temporary_report" RENAME TO "report"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "report" RENAME TO "temporary_report"`);
        await queryRunner.query(`CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "mileage" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "report"("id", "approved", "price", "make", "model", "year", "mileage", "lng", "lat", "userId") SELECT "id", "approved", "price", "make", "model", "year", "mileage", "lng", "lat", "userId" FROM "temporary_report"`);
        await queryRunner.query(`DROP TABLE "temporary_report"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "report"`);
    }
}
