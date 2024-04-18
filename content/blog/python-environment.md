---
title: Python 环境与依赖管理
date: 2024-04-18
published: true
description: 介绍 Python 几种环境和依赖管理方法的常见使用
image: '/images/OHR.AlbaceteSpain_ZH-CN1597281896_1920x1080.webp'
---

## Installation

```bash
pip install -r requirements/base.txt
```

## Anaconda

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

   ````

3. installation dependencies

   ```bash
   pip install rich request
   ```

4. write to txt file

   ```bash
   # 将宣布依赖写入 requirements/base.txt
   pip freeze requirements/base.txt
   # 只将指定的直接依赖写入 requirements/base.txt
   pip freeze | grep 'rich\|requests' > requirements/base.txt
   ```

5. upgrade conda[optional]

   ```bash
   conda update -n base -c defaults conda
   ```

Anaconda 的优缺点：
