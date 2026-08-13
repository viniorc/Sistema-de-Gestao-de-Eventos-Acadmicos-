# Convenções

Usar TypeScript estrito, nomes em inglês para código e português para textos de produto. Controllers são finos; serviços contém regras e DTOs definem contratos. Erros retornam `statusCode`, `code`, `message` e `details` somente quando seguros. Fixtures de dashboard devem ser explicitamente identificadas no código e nunca simulam persistência.
