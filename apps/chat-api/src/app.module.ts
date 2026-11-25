import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ProblemDetailsFilter } from './common/errors/problem-details.filter.js';
import { AppConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [AppConfigModule, DatabaseModule],
  providers: [
    { provide: APP_FILTER, useClass: ProblemDetailsFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
