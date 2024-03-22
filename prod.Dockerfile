FROM node:lts-alpine3.19 AS base

FROM base AS builder

WORKDIR /app

COPY . .

RUN npm i -g pnpm --registry=https://registry.npmmirror.com -y
RUN pnpm i --dev --registry=https://registry.npmmirror.com
RUN pnpm build

# RUN npx prisma generate

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1

# COPY prisma ./prisma/
# 使用 ENTRYPOINT sh 启动 #
# COPY prod.startup.sh ./prod.startup.sh
# RUN chmod +x /app/prod.startup.sh

# ENTRYPOINT ["sh", "/app/prod.startup.sh"]

# 使用 npm run start 启动 #
CMD npm start
EXPOSE 3000 

# 构建镜像 docker build -t yangtze-app:0.1.0 -f prod.Dockerfile .
# 运行镜像 docker run -p 3000:3000 yangtze-app:0.1.0