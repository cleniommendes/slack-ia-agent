import { Module } from '@nestjs/common';
import { PeopleModule } from '../people/people.module.js';
import { AccountsCommand } from './accounts.command.js';

@Module({
  imports: [PeopleModule],
  providers: [AccountsCommand],
  exports: [AccountsCommand],
})
export class AccountsModule {}
