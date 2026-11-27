import type { PasswordPrompt } from './password-prompt.js';

const ENTER = ['\r', '\n'];
const CTRL_C = '\u0003';
const BACKSPACE = ['\u007f', '\b'];

/** Lê a senha do terminal, sem eco. Recusa uma entrada que não é um terminal. */
export class TerminalPasswordPrompt implements PasswordPrompt {
  read(label: string): Promise<string> {
    const { stdin, stderr } = process;
    if (!stdin.isTTY) {
      return Promise.reject(
        new Error('A senha só é lida de um terminal, sem eco.'),
      );
    }

    stderr.write(`${label}: `);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    return new Promise((resolve, reject) => {
      let password = '';
      const finish = (end: () => void) => {
        stdin.removeListener('data', onData);
        stdin.setRawMode(false);
        stdin.pause();
        stderr.write('\n');
        end();
      };
      const onData = (chunk: string) => {
        for (const char of chunk) {
          if (ENTER.includes(char)) return finish(() => resolve(password));
          if (char === CTRL_C) {
            return finish(() => reject(new Error('Cancelado.')));
          }
          password = BACKSPACE.includes(char)
            ? password.slice(0, -1)
            : password + char;
        }
      };
      stdin.on('data', onData);
    });
  }
}
