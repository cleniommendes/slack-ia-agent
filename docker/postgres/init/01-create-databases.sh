#!/usr/bin/env bash
# Roda só com o volume vazio (LLD, seção 10, "Postgres").
# Cria os bancos chat, chat_test, agents e business, cada um com um usuário dono,
# e o business_readonly, que só conecta no business e só lê (ADR 0013).
# Nenhum usuário conecta num banco que não é o seu. Senhas iguais ao nome, só locais.
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<'SQL'
CREATE ROLE chat LOGIN PASSWORD 'chat';
CREATE ROLE agents LOGIN PASSWORD 'agents';
CREATE ROLE business LOGIN PASSWORD 'business';
CREATE ROLE business_readonly LOGIN PASSWORD 'business_readonly';

CREATE DATABASE chat OWNER chat;
CREATE DATABASE chat_test OWNER chat;
CREATE DATABASE agents OWNER agents;
CREATE DATABASE business OWNER business;

REVOKE CONNECT ON DATABASE chat FROM PUBLIC;
REVOKE CONNECT ON DATABASE chat_test FROM PUBLIC;
REVOKE CONNECT ON DATABASE agents FROM PUBLIC;
REVOKE CONNECT ON DATABASE business FROM PUBLIC;

GRANT CONNECT ON DATABASE chat TO chat;
GRANT CONNECT ON DATABASE chat_test TO chat;
GRANT CONNECT ON DATABASE agents TO agents;
GRANT CONNECT ON DATABASE business TO business, business_readonly;
SQL

# Somente leitura no business, inclusive nas tabelas que o script de carga criar depois.
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname business <<'SQL'
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE, CREATE ON SCHEMA public TO business;
GRANT USAGE ON SCHEMA public TO business_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO business_readonly;
ALTER DEFAULT PRIVILEGES FOR ROLE business IN SCHEMA public
  GRANT SELECT ON TABLES TO business_readonly;
ALTER ROLE business_readonly SET default_transaction_read_only = on;
SQL
