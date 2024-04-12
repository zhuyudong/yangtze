"""
cd src/app/[locale]/(unauth)/python
python crawl_ruanyifeng_weekly.py
"""

# import json
import math
import os
import re

import requests
from rich.console import Console

console = Console().print

categories_en = [
    "technology-news",
    "excerpts",
    "news",
    "tools",
    "photos",
    "articles",
    "resources",
    "quotations",
]
categories_cn = [
    "科技动态",
    "文摘",
    "文章",
    "资讯",
    "工具",
    "图片",
    "资源",
    "言论",
]
categories_locale = {
    "科技动态": "technology-news",
    "文摘": "excerpts",
    "文章": "articles",
    "工具": "tools",
    "资讯": "news",
    "图片": "photos",
    "资源": "resources",
    "言论": "quotations",
}


def get_issues():
    """
    获取所有 issues
    """
    res = requests.get("https://github.com/ruanyf/weekly")
    # ["294", ...]
    issues = re.findall(
        r"href=\"/ruanyf/weekly/blob/master/docs/issue-(\d+).md\"", res.text
    )
    # console(issues)
    return issues


def files_by_category(text: str, files: dict) -> None:
    categories = text.split("## ")
    for category in categories:
        for key in categories_cn:
            # ## 科技动态
            if category.strip().startswith(key):
                content = re.sub(r"\d、", "", category.strip().replace(key, ""))
                files[categories_locale[key]].append(content)


def crawler():
    issues = get_issues()
    files = {category: [] for category in categories_en}
    # keys = list(files.keys())
    for issue in issues:
        file_path = os.path.dirname(os.getcwd()) + f"/weekly-issues/{issue}.mdx"
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                # lines = f.readlines()
                text = f.read()
                files_by_category(text, files)
        else:
            res = requests.get(
                f"https://raw.githubusercontent.com/ruanyf/weekly/master/docs/issue-{issue}.md"
            )
            if res.ok:
                text = res.text
                with open(file_path, "w") as f:
                    f.write(text)
                    console(f"issue-{issue} saved.")
                files_by_category(text, files)
            else:
                console(f"issue-{issue} not found.")

    return files


def write_mdxs():
    files = crawler()
    for file_category, content in files.items():
        directory = (
            os.path.dirname(os.getcwd()) + f"/weekly-by-category/{file_category}"
        )
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(f"{directory}/page.mdx", "w") as f:
            _content = "\n".join(content)
            # remove <!----> comments
            _content = re.sub(r"<!--(.*?)-->", "", _content, flags=re.DOTALL)
            # remove <br> tag
            _content = re.sub(r"(?<=[\u4e00-\u9fa5\w.,。，])<br>", "", _content)
            # close <source> tag
            _content = re.sub(r"<source[^>]*>", r"\g<0></source>", _content)
            # 《<进步与贫困>书评》 -> 《\<进步与贫困>书评》
            _content = re.sub(r"《<([^>]+)>", r"《\\<\1>", _content)
            # <1 -> < 1
            _content = re.sub(r"<(\d+)", r"< \1", _content)
            # TODO: ></source> -> />
            f.write(_content)
            console(
                f"src/app/[locale]/(unauth)/weekly-by-category/{file_category}/page.mdx saved."
            )


def add_index():
    write_mdxs()

    for category in categories_en:
        index = 1
        with open(os.getcwd() + f"/{category}.mdx", "r") as f:
            lines = f.readlines()
            for line in lines:
                is_title = re.match("\[[\w\s\-（）、.\u4e00-\u9fa5]*\]\(", line)  # noqa: W605
                if is_title:
                    line = f"#### {index}. {line}"
                    index += 1
                if (
                    category == "quotations"
                    and re.match("[\w\u4e00-\u9fa5]+", line)
                    and not re.match("--", line)
                ):
                    line = f"> {line}"

                filename = (
                    f"/{category}{math.floor(index/100)}01~{math.ceil(index/100)}00.mdx"
                )
                if index <= 101:
                    filename = f"/{category}1~100.mdx"
                if index in list(range(200, 10000, 100)):
                    filename = f"/{category}{math.floor((index - 1)/100)}01~{math.ceil((index - 1)/100)}00.mdx"
                if index in list(range(201, 10000, 100)):
                    filename = f"/{category}{math.floor((index - 2)/100)}01~{math.ceil((index - 2)/100)}00.mdx"
                if index in list(range(102, 10000, 100)):
                    filename = f"/{category}{math.floor(index/100)}01~{math.ceil(index/100)}00.mdx"
                # console(index, filename)
                with open(
                    os.getcwd() + filename,
                    "a+",
                ) as f:
                    f.write(line)


if __name__ == "__main__":
    write_mdxs()
    # add_index()
