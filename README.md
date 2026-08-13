# CONEXÃO — Gestão de Eventos Acadêmicos / PROMIC

Plataforma para a gestão de eventos acadêmicos do PROMIC. O repositório usa monorepo pnpm e monólito modular: Next.js 16 em `apps/web`, NestJS 11 em `apps/api`, e PostgreSQL 18 acessado exclusivamente pela API com Prisma 7.

## Estado atual

Somente a Fundação Técnica e o Incremento 1A foram implementados: autenticação inicial, eventos mínimos para seleção de edição, shell responsivo, dashboard demonstrativo e página de design system. Trabalhos, avaliadores, avaliações, bancas, certificados e os demais módulos previstos não foram antecipados.

## Requisitos

Node.js 24 LTS, pnpm 10+, Docker Desktop e Docker Compose. Copie `.env.example` para `.env` e substitua os valores locais antes de iniciar. Nunca use os valores de exemplo em produção.

## Desenvolvimento local

```bash
cp .env.example .env
docker compose up -d postgres
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Web: `http://localhost:3000`; API: `http://localhost:3001/api/v1`; Swagger: `http://localhost:3001/api/docs`.

Credencial DEV local: `mariana@conexao.local`, com a senha definida em `DEV_USER_PASSWORD` no `.env`. Ela não deve ser usada fora do ambiente local.

## Docker

Com `.env` configurado, inicie todos os serviços com:

```bash
docker compose up --build
```

O banco tem volume persistente e healthcheck; a API aplica migrations no boot. Para semear dentro do container: `docker compose exec api pnpm --filter @conexao/api prisma:seed`.

## E2E

Com PostgreSQL, API e web em execução, instale o navegador uma vez com `pnpm --filter @conexao/web exec playwright install chromium` e execute `pnpm test:e2e`. A suíte verifica o redirecionamento sem sessão e o login real do usuário DEV; defina `E2E_DEV_USER_PASSWORD` se a senha local for diferente de `local-dev-password`.

## Comandos

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @conexao/web exec playwright install chromium
pnpm test:e2e
pnpm build
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

## Estrutura

```text
apps/web       # Next.js, interface e componentes
apps/api       # NestJS, REST /api/v1, Swagger e Prisma
packages/      # api-client e design-tokens compartilhados
docs/          # arquitetura, desenvolvimento, convenções e ADRs
infra/docker/  # imagens de API e web
```

As decisões arquiteturais estão em [docs/architecture.md](docs/architecture.md) e nos ADRs. A API valida `NODE_ENV`, `DATABASE_URL`, `API_PORT`, `CORS_ORIGIN`, JWT secrets e TTLs ao iniciar. Ela não retorna stack traces e mantém JWTs em cookies HttpOnly, com `Secure` em produção. O seletor consulta eventos reais na API, mantém a seleção em contexto e persiste apenas o UUID no cookie `conexao-event-id`.
