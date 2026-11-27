import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleService } from './people.service.js';
import { Person } from './person.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
