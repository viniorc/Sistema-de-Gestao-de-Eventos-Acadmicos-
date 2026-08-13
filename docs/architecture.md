# Arquitetura

O CONEXÃO usa um monorepo pnpm com monólito modular: `apps/web` (Next.js) chama `apps/api` (NestJS) por REST; apenas a API acessa PostgreSQL via Prisma. Essa separação mantém a interface independente sem introduzir custo operacional de microserviços.

Os módulos atuais da API são `auth`, `users`, `events`, `health` e `prisma`. Módulos futuros serão acrescentados somente quando o incremento correspondente for solicitado. Armazenamento de arquivos e trabalhos em fila serão abstraídos por serviços quando passarem a ser necessários; S3/MinIO, Redis e filas não fazem parte deste incremento.

O seletor de edição é guardado no cookie `conexao-event-id`: é pequeno, não exige store global e permite que futuras páginas server-side conheçam a edição selecionada.
