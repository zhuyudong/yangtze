# yangtze

## Build && Start

`copy .env.example .env`

### 使用 pnpm [本地]

```bash
pnpm build
pnpm start
```

### 使用 docker [生产]

构建镜像

```bash
docker build --no-cache -t yangtze-app:0.1.0 -f Dockerfile .
# or
docker build --no-cache -t yangtze-app:0.1.0 .
# or
docker build --no-cache . -t yangtze-app:0.1.0
```

运行镜像

```bash
docker run -p 3000:3000 yangtze-app:0.1.0
```

## TODO

- [x] FIXME: https://github.com/vercel/next.js/issues/51477

## Reference

- [pnpm](https://pnpm.io/)
- [Better Stack](https://betterstack.com/)
- [zeabur](https://zeabur.com/docs/zh-CN/guides/nodejs)
- [zeabur serverless](https://zeabur.com/docs/zh-CN/deploy/serverless)
- [yet-another-react-lightbox](https://yet-another-react-lightbox.com/)
- [dockerhub](https://hub.docker.com/_/node/tags)
- [heroicons](https://heroicons.com/micro)
