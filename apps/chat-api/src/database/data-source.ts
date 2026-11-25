import { DataSource } from 'typeorm';
import { loadEnv } from '../config/env.schema.js';
import { buildDataSourceOptions } from './database.options.js';

/** DataSource da CLI do TypeORM (migrações). A aplicação usa o DatabaseModule. */
export default new DataSource({
  ...buildDataSourceOptions(loadEnv().DATABASE_URL),
  entities: [`${import.meta.dirname}/**/*.entity.{ts,js}`],
  migrations: [`${import.meta.dirname}/../../migrations/*.{ts,js}`],
});
