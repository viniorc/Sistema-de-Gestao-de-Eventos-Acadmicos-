FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile=false
COPY . .
RUN pnpm --filter @conexao/web build
EXPOSE 3000
CMD ["pnpm", "--filter", "@conexao/web", "start"]
