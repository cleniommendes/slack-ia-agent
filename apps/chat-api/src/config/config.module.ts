import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { parseEnv } from './env.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validate: parseEnv,
    }),
  ],
})
export class AppConfigModule {}
