# CONEXÃO / PROMIC — regras de trabalho

## Escopo

Implemente somente o incremento solicitado. Prepare a arquitetura para expansão, mas não construa recursos antes de serem solicitados. Nunca suponha que existe apenas uma edição: dados de uma edição devem ser associados a `eventId` quando aplicável.

## TypeScript e frontend

- `strict` é obrigatório; não use `any` ou `@ts-ignore` sem justificativa documentada.
- Tipar DTOs e fronteiras. Não duplicar contratos sem motivo.
- Separar componentes, features, services, hooks e lib. Não colocar regra de negócio ou HTTP diretamente em páginas.
- Usar Server/Client Components conscientemente. Não acessar o banco pelo frontend.
- Usar os tokens e componentes do design system; não repetir cores, espaçamentos ou botões arbitrários e não copiar HTML do Stitch literalmente.

## Backend

- Controllers recebem, validam, delegam e respondem; regras vivem em services/use cases.
- Prisma pertence à camada de persistência, nunca a controllers. Não expor modelos Prisma como contrato público por conveniência.
- Módulos têm responsabilidades delimitadas, sem importações circulares; comunicação por serviços/interfaces públicos.
- Rotas públicas são versionadas em `/api/v1`; respostas de erro não expõem detalhes internos.

## Dados, segurança e dependências

- Nunca editar migrations aplicadas; criar uma nova migration para cada alteração de schema.
- Usar constraints, índices e foreign keys quando aplicáveis. Datas no banco em UTC.
- Nunca commitar secrets, logar senha/tokens/cookies, armazenar senha em texto ou JWT no localStorage.
- Validar entradas no backend e aplicar menor privilégio. Não confiar apenas no frontend.
- Antes de instalar dependência, verificar recursos nativos e dependências existentes.

## Qualidade e documentação

- Regras críticas e bugs relevantes devem ter testes. Não remover testes para passar pipeline.
- Atualizar `docs/` e ADRs para mudanças arquiteturais. README deve continuar correto.
- Antes de concluir: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` e E2E quando aplicável.
- Não criar código morto, TODO genérico, abstração prematura, microserviço, infraestrutura futura vazia ou módulos de negócio não solicitados.
