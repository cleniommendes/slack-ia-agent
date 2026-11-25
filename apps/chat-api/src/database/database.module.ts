import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Env } from '../config/env.schema.js';
import { buildDataSourceOptions } from './database.options.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        ...buildDataSourceOptions(config.get('DATABASE_URL', { infer: true })),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
