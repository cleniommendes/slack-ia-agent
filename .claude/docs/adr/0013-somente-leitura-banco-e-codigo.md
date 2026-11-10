---
status: aceita
---

# 0013 · Somente leitura garantido pelo banco e pelo código

O agente consulta o Banco de negócio com um usuário de banco só com leitura e sem acesso aos outros bancos, e o código confere antes que a consulta é só de leitura. O banco garante mesmo com a consulta manipulada (objetivo d), e o código recusa cedo.

Descartadas: garantia só no banco; garantia só no código.
Custo aceito: duas regras para manter alinhadas; as permissões precisam ser configuradas com cuidado, porque os bancos dividem a mesma instância.
