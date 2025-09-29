FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache curl


# ✅ include pnpm-lock.yaml here
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @endolib/api build

EXPOSE 3000
CMD ["pnpm","--filter","@endolib/api","start"]
