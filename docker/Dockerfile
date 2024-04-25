FROM node:lts-alpine3.19
# FROM node20.12.2-alpine3.18-pnpm:9.0.6

WORKDIR /app

COPY . .

# NOTE: 如果没有使用本地自带 pnpm 的 Node.js 镜像，需要全局安装 pnpm
RUN npm i -g pnpm --registry=https://registry.npmmirror.com
RUN pnpm install --registry=https://registry.npmmirror.com

# RUN npx prisma generate

RUN chmod +x /app/startup.sh

ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

# NOTE: 因为 WORKDIR /app，所以这里的路径是相对于 /app 的
# 等效于 ENTRYPOINT ["sh", "/app/startup.sh"]
ENTRYPOINT ["/app/startup.sh"]