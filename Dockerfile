# Install dependencies only when needed
FROM node:20-slim AS deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production \
  APP_PATH=/app
RUN corepack enable

# FIXME
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app
# WORKDIR ${APP_PATH}
COPY package.json pnpm-lock.yaml ./

FROM deps AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /app
COPY . .
# COPY --from=deps /app/node_modules ./node_modules
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Production image, copy all the files and run next
FROM deps AS runner
WORKDIR /app

ENV NODE_ENV production

# RUN sudo addgroup -g 1001 -S nodejs
# RUN sudo adduser -S nextjs -u 1001

# You only need to copy next.config.mjs if you are NOT using the default configuration
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV NEXT_TELEMETRY_DISABLED 1

# NOTE: "next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.
CMD ["node_modules/.bin/next", "start"]
# or
# CMD ["pnpm", "start"]

# 构建镜像 docker build -t yangtze-app:0.1.0 -f Dockerfile . 或 docker build -t yangtze-app:0.1.0 .
# 运行镜像 docker run -p 3000:3000 yangtze-app:0.1.0