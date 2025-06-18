FROM node:lts-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat

COPY . /opt/app
WORKDIR /opt/app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /opt/app
COPY --from=deps /opt/app/node_modules ./node_modules
COPY --from=deps /opt/app/packages/site/node_modules ./packages/site/node_modules
COPY --from=deps /opt/app/packages/snap/node_modules ./packages/snap/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /opt/app/
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /opt/app/packages/site/.next/standalone standalone
COPY --from=builder --chown=nextjs:nodejs /opt/app/packages/site/public standalone/packages/site/public
COPY --from=builder --chown=nextjs:nodejs /opt/app/packages/site/.next/static standalone/packages/site/.next/static

USER nextjs

EXPOSE 8000

ENV PORT=8000
ENV NEXT_PRIVATE_STANDALONE=true

ENTRYPOINT [ "node", "/opt/app/standalone/packages/site/server.js" ]