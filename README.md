# Yangtze

[website](https://yangtze.zeabur.app)

## Installing

```bash
pnpm i
```

## Develop【本地开发】

```bash
pnpm dev
```

## Start 【生产环境】

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
docker build --progress=plain --no-cache -t yangtze-app:0.1.0 -f Dockerfile .
# or
docker build --no-cache -t yangtze-app:0.1.0 .
# or
docker build --no-cache . -t yangtze-app:0.1.0
```

运行镜像

```bash
docker run -p 3000:3000 yangtze-app:0.1.0
```

open [http://localhost:3000](http://localhost:3000)

## TODO

- [x] FIXME: [#issue51477](https://github.com/vercel/next.js/issues/51477)
- [x] FIXME: 生产环境下 /blog 页面报错
  ```bash
    Error: Usage of next-intl APIs in Server Components currently opts into dynamic rendering. This limitation will eventually be lifted, but as a stopgap solution, you can use the `unstable_setRequestLocale` API to enable static rendering, see https://next-intl-docs.vercel.app/docs/getting-started/app-router-server-components#static-rendering
      at ~/Code/my-opensource/yangtze/.next/server/chunks/3552.js:1:41199
      at ~/Code/my-opensource/yangtze/node_modules/.pnpm/next@14.2.3_@opentelemetry+api@1.8.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:185493
      ... 5 lines matching cause stack trace ...
      at eh (~/Code/my-opensource/yangtze/node_modules/.pnpm/next@14.2.3_@opentelemetry+api@1.8.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:134786)
      at e (~/Code/my-opensource/yangtze/node_modules/.pnpm/next@14.2.3_@opentelemetry+api@1.8.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:137671)
      at ek (~/Code/my-opensource/yangtze/node_modules/.pnpm/next@14.2.3_@opentelemetry+api@1.8.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145) {
    digest: '569812901',
    [cause]: n [Error]: Dynamic server usage: Route /zh/blog/next-mdx_tutorial couldn't be rendered statically because it used headers. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
        at l (~/Code/my-opensource/yangtze/.next/server/chunks/3570.js:1:56076)
        at d (~/Code/my-opensource/yangtze/.next/server/chunks/6725.js:30:24360)
        at ~/Code/my-opensource/yangtze/.next/server/chunks/3552.js:1:41101
        at ~/Code/my-opensource/yangtze/node_modules/.pnpm/next@14.2.3_@opentelemetry+api@1.8.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:185493
        at u (~/Code/my-opensource/yangtze/.next/server/chunks/3552.js:1:41941)
        at ~/Code/my-opensource/yangtze/.next/server/chunks/3689.js:7:3142
        at i (~/Code/my-opensource/yangtze/.next/server/chunks/3689.js:7:3145)
        at s (~/Code/my-opensource/yangtze/.next/server/chunks/3689.js:7:3933)
        at O (~/Code/my-opensource/yangtze/.next/server/chunks/4992.js:1:3527)
        at eh (~/Code/my-opensource/yangtze/node_modules/.pnpm/next@14.2.3_@opentelemetry+api@1.8.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:134786) {
      description: "Route /zh/blog/next-mdx_tutorial couldn't be rendered statically because it used headers. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
      digest: 'DYNAMIC_SERVER_USAGE'
    }
  }
  ```
  暂时解决方案参见 [1](https://github.com/amannn/next-intl/issues/521) 和 [2](https://github.com/amannn/next-intl/issues/663)

## Reference

- [NEXT.js](https://nextjs.org/)
- [pnpm](https://pnpm.io/)
- [prisma](https://www.prisma.io/docs)
- [shadcn/ui](https://github.com/shadcn-ui/ui)
- [contentlayer](https://contentlayer.dev/)
- [zeabur](https://zeabur.com/docs/zh-CN/guides/nodejs)
- [zeabur serverless](https://zeabur.com/docs/zh-CN/deploy/serverless)
- [yet-another-react-lightbox](https://yet-another-react-lightbox.com/)
- [dockerhub](https://hub.docker.com/_/node/tags)
- [heroicons](https://heroicons.com/micro)
- [uploadthing](https://uploadthing.com/)
- [simpleicons](https://simpleicons.org/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [pino](https://getpino.io/#/)
- [Better Stack](https://betterstack.com/)
- [Mermaid](https://mermaid.js.org/syntax/sequenceDiagram.html)
- [rehype-pretty-code](https://rehype-pretty.pages.dev/#usage)
- [remark-code-import](https://github.com/kevin940726/remark-code-import)
