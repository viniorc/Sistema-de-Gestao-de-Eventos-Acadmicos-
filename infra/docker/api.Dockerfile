FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile=false
COPY . .
RUN pnpm --filter @conexao/api build
EXPOSE 3001
CMD ["sh", "-c", "pnpm --filter @conexao/api prisma:deploy && node apps/api/dist/main.js"]
