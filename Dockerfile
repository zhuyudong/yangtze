FROM node:20-alpine AS base

FROM base AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# ENV NODE_ENV=production \
#   APP_PATH=/app
RUN corepack enable

# prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
# NOTE: node:20-alpine 镜像没有 apt-get 命令，所以无法安装 openssl
# FIXME: bcrypt
# RUN apk update && apk add --no-cache --virtual .gyp python3 make g++

WORKDIR /app
# WORKDIR ${APP_PATH}

COPY . .

# RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm cache clean --force && rm -rf node_modules && pnpm i --frozen-lockfile --registry=https://registry.npmmirror.com

RUN npx prisma generate

RUN npm run build

FROM base AS runner

WORKDIR /app

ENV PORT=3000

# RUN sudo addgroup -g 1001 -S nodejs
# RUN sudo adduser -S nextjs -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src ./src
# COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.next ./.next
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/mdx-components.tsx ./mdx-components.tsx
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/postcss.config.js ./postcss.config.js
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

# COPY startup.sh ./startup.sh
# RUN chmod +x /app/startup.sh

# ENTRYPOINT ["sh", "/app/startup.sh"]
# NOTE: "next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.
CMD ["node_modules/.bin/next", "start"]

# 构建镜像 docker build -t yangtze-app:0.1.0 -f Dockerfile . 或 docker build -t yangtze-app:0.1.0 . 或 docker build . -t yangtze-app:0.1.0
# 运行镜像 docker run -p 3000:3000 yangtze-app:0.1.0