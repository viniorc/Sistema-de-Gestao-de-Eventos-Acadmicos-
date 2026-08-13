# Desenvolvimento

Copie `.env.example` para `.env`, inicie PostgreSQL com `docker compose up -d postgres`, instale dependências (`pnpm install`), aplique `pnpm db:migrate`, rode `pnpm db:seed` e use `pnpm dev`.

API: `http://localhost:3001/api/v1`, Swagger: `http://localhost:3001/api/docs`, web: `http://localhost:3000`. Para a pilha completa em containers: `docker compose up --build`.

Migrations são imutáveis depois de aplicadas. Use `pnpm db:migrate` localmente; o container da API aplica migrations no boot. Execute `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` antes de integrar mudanças.
