/** Como o comando lê a senha. O teste a substitui pela entrada dada. */
export interface PasswordPrompt {
  read(label: string): Promise<string>;
}
