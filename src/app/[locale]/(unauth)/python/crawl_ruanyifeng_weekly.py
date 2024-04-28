"""
cd src/app/[locale]/(unauth)/python && python crawl_ruanyifeng_weekly.py
# or
python src/app/[locale]/(unauth)/python/crawl_ruanyifeng_weekly.py
"""

# import json
# import math
import os
import re
import subprocess

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
    "新闻",
    "工具",
    "图片",
    "本周图片",
    "资源",
    "言论",
    "本周金句",
]
categories_locale = {
    "科技动态": "technology-news",
    "文摘": "excerpts",
    "文章": "articles",
    "工具": "tools",
    "资讯": "news",
    "新闻": "news",
    "图片": "photos",
    "本周图片": "photos",
    "资源": "resources",
    "言论": "quotations",
    "本周金句": "quotations",
}


def find_root_path(current_path: str = os.getcwd()) -> str:
    path = os.path.abspath(current_path)
    if "node_modules" in os.listdir(path):
        return current_path

    parent_dir = os.path.dirname(current_path)

    return find_root_path(parent_dir)


root_path = find_root_path()

eslint_path = os.path.join(root_path, "node_modules/.bin/eslint")


def formatting(file_path: str) -> None:
    process = subprocess.Popen(
        [eslint_path, "--fix", "--color", file_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    stdout, stderr = process.communicate()
    return stdout, stderr


def get_issues():
    """
    获取所有 issues
    """
    res = requests.get("https://github.com/ruanyf/weekly")
    # ["297", ...]
    issues = re.findall(
        r"href=\"/ruanyf/weekly/blob/master/docs/issue-(\d+).md\"", res.text
    )
    # console(issues)
    return issues


def files_by_category(text: str, files: dict, weekly: int) -> None:
    categories = text.split("## ")
    for category in categories:
        for key in categories_cn:
            """
            ## 科技动态
            """
            if category.strip().startswith(key):
                # 1、[
                p1 = r"\d+、\s*(\[.*)"
                # 2、**
                p2 = r"\d+、\s*(\*\*.*)"
                content = category.strip().replace(key, "")
                if re.search(p1, content):
                    content = re.sub(p1, r"\1", content)
                if re.search(p2, content):
                    content = re.sub(p2, r"\1", content)

                if re.search(r"\*\*\d+、", content):
                    content = re.sub(r"(\*\*)\d+、", r"\1", content)
                # NOTE: 在内容中暂存 issue 编号，parse md 时擦除
                content = f"\n==={weekly}===\n" + content
                files[categories_locale[key]].append(content)


def crawler():
    issues = get_issues()
    files = {category: [] for category in categories_en}
    for issue in issues:
        # yangtze/weekly-issues/297.mdx,...
        file_path = root_path + f"/weekly-issues/{issue}.mdx"
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                text = f.read()
                files_by_category(text, files, weekly=int(issue))
        else:
            res = requests.get(
                f"https://raw.githubusercontent.com/ruanyf/weekly/master/docs/issue-{issue}.md"
            )
            if res.ok:
                text = res.text.replace("<br>", "")
                with open(file_path, "w") as f:
                    console(f"issue-{issue} write and formatting start...")
                    f.write(text)
                    # stdout, stderr = formatting(file_path)
                    formatting(file_path)
                    # console(stdout, stderr)
                    console(f"issue-{issue} saved and formatting.")
                files_by_category(text, files, weekly=int(issue))
            else:
                console(f"issue-{issue} not found.")

    return files


def write_mdxs():
    files = crawler()
    for file_category, content in files.items():
        directory = (
            root_path + f"/src/app/[locale]/(unauth)/weekly-by-category/{file_category}"
        )
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(f"{directory}/_page.mdx", "w") as f:
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
                f"src/app/[locale]/(unauth)/weekly-by-category/{file_category}/_page.mdx saved."
            )
            console("formatting start...")
            formatting(f"{directory}/_page.mdx")
            # console(stdout, stderr)
            console("formatting done.")


# def add_index():
#     write_mdxs()

#     for category in categories_en:
#         index = 1
#         with open(os.getcwd() + f"/{category}.mdx", "r") as f:
#             lines = f.readlines()
#             for line in lines:
#                 is_title = re.match("\[[\w\s\-（）、.\u4e00-\u9fa5]*\]\(", line)  # noqa: W605
#                 if is_title:
#                     line = f"#### {index}. {line}"
#                     index += 1
#                 if (
#                     category == "quotations"
#                     and re.match("[\w\u4e00-\u9fa5]+", line)
#                     and not re.match("--", line)
#                 ):
#                     line = f"> {line}"

#                 filename = (
#                     f"/{category}{math.floor(index/100)}01~{math.ceil(index/100)}00.mdx"
#                 )
#                 if index <= 101:
#                     filename = f"/{category}1~100.mdx"
#                 if index in list(range(200, 10000, 100)):
#                     filename = f"/{category}{math.floor((index - 1)/100)}01~{math.ceil((index - 1)/100)}00.mdx"
#                 if index in list(range(201, 10000, 100)):
#                     filename = f"/{category}{math.floor((index - 2)/100)}01~{math.ceil((index - 2)/100)}00.mdx"
#                 if index in list(range(102, 10000, 100)):
#                     filename = f"/{category}{math.floor(index/100)}01~{math.ceil(index/100)}00.mdx"
#                 # console(index, filename)
#                 with open(
#                     os.getcwd() + filename,
#                     "a+",
#                 ) as f:
#                     f.write(line)


if __name__ == "__main__":
    write_mdxs()
    # add_index()
