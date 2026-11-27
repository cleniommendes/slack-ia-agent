import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { toPersonView, type PersonView } from '../people/person.view.js';
import { Person } from '../people/person.entity.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthenticatedPerson } from './authenticated-person.decorator.js';
import { AuthenticatedSessionId } from './authenticated-session-id.decorator.js';
import { SessionGuard } from './session.guard.js';
import { SessionsService } from './sessions.service.js';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Post()
  async login(
    @Body() body: LoginDto,
  ): Promise<{ token: string; person: PersonView }> {
    const { token, person } = await this.sessions.login(
      body.email,
      body.password,
    );
    return { token, person: toPersonView(person) };
  }

  @Get('current')
  @UseGuards(SessionGuard)
  current(@AuthenticatedPerson() person: Person): { person: PersonView } {
    return { person: toPersonView(person) };
  }

  /** Sai: apaga só a Sessão apresentada. As outras Sessões da Pessoa continuam valendo. */
  @Delete('current')
  @HttpCode(204)
  @UseGuards(SessionGuard)
  async logout(@AuthenticatedSessionId() sessionId: string): Promise<void> {
    await this.sessions.revoke(sessionId);
  }
}
