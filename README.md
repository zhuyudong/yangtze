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

## 使用 next-auth 登录流程

> src/server/auth.ts

1. `/api/auth/session`
2. `/api/auth/providers`
3. `/zh/api/auth/csrf`: `Credentials.authorize` -> `callbacks.jwt` -> `events.signIn`
4. `/api/auth/callback/credentials`: `callbacks.jwt` -> `callbacks.session`
5. `/zh/api/auth/session`

## 使用 [pino](https://getpino.io/#/) 结合 [Better Stack](https://betterstack.com/) 记录日志

1. 安装依赖
   ```bash
   pnpm i @logtail/pino pino pino-pretty
   ```
2. 设置环境变量

   > .env

   ```bash
   LOGTAIL_SOURCE_TOKEN=xxx
   ```

3. 封装 logger 实例

   > src/lib/logger.ts

   ```ts
   import pino from 'pino'

   import { env } from '../env.mjs'

   let options = {}

   if (env.LOGTAIL_SOURCE_TOKEN) {
     options = {
       transport: {
         target: '@logtail/pino',
         options: { sourceToken: env.LOGTAIL_SOURCE_TOKEN }
       }
     }
   } else {
     options = {
       transport: {
         target: 'pino-pretty',
         options: {
           colorize: true
         }
       }
     }
   }

   export const logger = pino(options)
   ```

4. 在 api 接口里记录日志

   > src/app/[locale]/api/contents/favorite/route.ts

   ```ts
   import type { NextRequest } from 'next/server'
   import { NextResponse } from 'next/server'

   import { logger } from '@/lib/logger'
   import { serverAuth } from '@/lib/server-auth'
   import { db } from '@/server/db'

   async function handler(req: NextRequest) {
     try {
       const { currentUser } = await serverAuth()

       if (!currentUser) {
         return NextResponse.json(
           { message: 'Please sign in' },
           { status: 401 }
         )
       }

       const { contentId } = await req.json()

       if (req.method === 'POST') {
         // async actions
         logger.info(
           'User %s favorited content %s',
           currentUser.email,
           contentId
         )
         return NextResponse.json({
           //...
         })
       }

       return NextResponse.json(
         { message: 'Method not allowed' },
         { status: 405 }
       )
     } catch (error) {
       console.log(error)

       return NextResponse.json({ error }, { status: 500 })
     }
   }

   export { handler as POST }
   ```

5. 在 [https://logs.betterstack.com/team/257329/tail](https://logs.betterstack.com/team/257329/tail) 查看 实时日志

## Reference

- [pnpm](https://pnpm.io/)
- [zeabur](https://zeabur.com/docs/zh-CN/guides/nodejs)
- [zeabur serverless](https://zeabur.com/docs/zh-CN/deploy/serverless)
- [yet-another-react-lightbox](https://yet-another-react-lightbox.com/)
- [dockerhub](https://hub.docker.com/_/node/tags)
- [heroicons](https://heroicons.com/micro)
- [simpleicons](https://simpleicons.org/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [pino](https://getpino.io/#/)
- [Better Stack](https://betterstack.com/)
- [Mermaid](https://mermaid.js.org/syntax/sequenceDiagram.html)
