import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { AccountsCommand } from './accounts.command.js';
import { TerminalPasswordPrompt } from './terminal-password-prompt.js';

/** Sobe o contexto do Nest sem HTTP e roda o comando de contas. */
async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });
  try {
    const result = await app
      .get(AccountsCommand)
      .run(process.argv.slice(2), new TerminalPasswordPrompt());
    (result.ok ? console.log : console.error)(result.message);
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

await main();
