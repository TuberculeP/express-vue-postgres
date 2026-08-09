import "reflect-metadata";
import "dotenv/config";
import path from "path";
import { DataSource } from "typeorm";
import entities from "./entities";

const { POSTGRES_URL, NODE_ENV } = process.env;
const synchronize = NODE_ENV !== "production";
const migrations = [path.join(__dirname, "../migrations/*.{ts,js}")];

let pg: DataSource;

if (POSTGRES_URL) {
  pg = new DataSource({
    type: "postgres",
    url: POSTGRES_URL,
    synchronize,
    entities,
    migrations,
    migrationsTableName: "migration_table",
  });
} else {
  console.warn("POSTGRES_URL not provided. Falling back to SQLite.");
  pg = new DataSource({
    type: "sqlite",
    database: "sqlite.db",
    synchronize,
    entities,
    migrations,
    migrationsTableName: "migration_table",
  });
}

export default pg;
