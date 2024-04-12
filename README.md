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
docker build -t yangtze-app:0.1.0 -f Dockerfile .
# or
docker build -t yangtze-app:0.1.0 .
# or
docker build . -t yangtze-app:0.1.0
```

运行镜像

```bash
docker run -p 3000:3000 yangtze-app:0.1.0
```

## Installation

```bash
pip install -r requirements/base.txt
```

## Python Environment

1. create virtual environment

   ```bash
   conda create -n yangtze python=3.11
   conda activate yangtze
   ```

2. set registry

   ```bash
   # 阿里云源
   pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
   pip config set install.trusted-host mirrors.aliyun.com
   # or
   # 清华源
   pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/
   pip config set install.trusted-host pypi.tuna.tsinghua.edu.cn
   ```

or `vim ~/.config/pip/pip.conf`

    ````bash
    [global]
    index-url = https://mirrors.aliyun.com/pypi/simple/

    [install]
    trusted-host = mirrors.aliyun.com
    ```

3. installation dependencies

   ```bash
   pip install rich request
   ```

4. write to txt file

   ```bash
   pip freeze | grep 'rich\|requests' > requirements/base.txt
   ```

5. upgrade conda[optional]

   ```bash
   conda update -n base -c defaults conda
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
