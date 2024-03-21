# yangtze

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
- [yet-another-react-lightbox](https://yet-another-react-lightbox.com/)
