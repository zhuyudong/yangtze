"""
cd src/app/[locale]/(unauth)/python
python crawly_ruanyifeng_weekly.py
"""

# import json
import math
import os
import re

import requests
from rich.console import Console

console = Console().print


def get_issues():
    """
    获取 issues
    """
    res = requests.get("https://github.com/ruanyf/weekly")
    # ["262", ...]
    issues = re.findall(
        r"href=\"/ruanyf/weekly/blob/master/docs/issue-(\d+).md\"", res.text
    )
    return issues


def crawler():
    issues = get_issues()
    files = {
        "科技动态": [],
        "工具": [],
        "资源": [],
        "图片": [],
        "文摘": [],
        "言论": [],
    }
    keys = list(files.keys())
    for issue in issues:
        # 从网络拉取 #
        res = requests.get(
            f"https://raw.githubusercontent.com/ruanyf/weekly/master/docs/issue-{issue}.md"
        )
        text = res.text
        with open(os.getcwd() + f"/issues/{issue}.md", "w") as f:
            f.write(text)
        categories = text.split("##")
        for category in categories:
            for key in keys:
                if category.strip().startswith(key):
                    files[key].append(
                        re.sub(r"\d、", "", category.strip().replace(key, ""))
                    )
        # 本地读取 #
        # with open(os.getcwd() + f"/issues/{issue}.md", "r") as f:
        #     # lines = f.readlines()
        #     text = f.read()
        #     categories = text.split("##")
        #     for category in categories:
        #         for key in keys:
        #             if category.strip().startswith(key):
        #                 content = re.sub(r"\d、", "", category.strip().replace(key, ""))
        #                 files[key].append(content)
    return files


def write_mds():
    files = crawler()
    for file_category, content in files.items():
        with open(os.getcwd() + f"/{file_category}.md", "w") as f:
            f.write("\n".join(content))


def add_index():
    write_mds()
    categories = ["科技动态", "工具", "资源", "图片", "文摘", "言论"]
    for category in categories:
        index = 1
        with open(os.getcwd() + f"/{category}.md", "r") as f:
            lines = f.readlines()
            for line in lines:
                is_title = re.match("\[[\w\s\-（）、.\u4e00-\u9fa5]*\]\(", line)  # noqa: W605
                if is_title:
                    line = f"#### {index}. {line}"
                    index += 1
                if (
                    category == "言论"
                    and re.match("[\w\u4e00-\u9fa5]+", line)
                    and not re.match("--", line)
                ):
                    line = f"> {line}"

                filename = (
                    f"/{category}{math.floor(index/100)}01~{math.ceil(index/100)}00.md"
                )
                if index <= 101:
                    filename = f"/{category}1~100.md"
                if index in list(range(200, 10000, 100)):
                    filename = f"/{category}{math.floor((index - 1)/100)}01~{math.ceil((index - 1)/100)}00.md"
                if index in list(range(201, 10000, 100)):
                    filename = f"/{category}{math.floor((index - 2)/100)}01~{math.ceil((index - 2)/100)}00.md"
                if index in list(range(102, 10000, 100)):
                    filename = f"/{category}{math.floor(index/100)}01~{math.ceil(index/100)}00.md"
                # console(index, filename)
                with open(
                    os.getcwd() + filename,
                    "a+",
                ) as f:
                    f.write(line)


if __name__ == "__main__":
    write_mds()
    add_index()
