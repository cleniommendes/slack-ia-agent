// Aponta a aplicação de teste para o banco chat_test, antes de importar o AppModule.
const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (testDatabaseUrl) {
  process.env.DATABASE_URL = testDatabaseUrl;
}
