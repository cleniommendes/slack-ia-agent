import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from '../people/people.module.js';
import { Session } from './session.entity.js';
import { SessionGuard } from './session.guard.js';
import { SessionsController } from './sessions.controller.js';
import { SessionsService } from './sessions.service.js';

@Module({
  imports: [PeopleModule, TypeOrmModule.forFeature([Session])],
  controllers: [SessionsController],
  providers: [SessionsService, SessionGuard],
  exports: [SessionsService, SessionGuard],
})
export class SessionsModule {}
