"""
cd src/app/[locale]/(unauth)/python
python crawl_bing_wallpaper.py
"""

import json
import os
import time
from datetime import datetime, timedelta
from threading import Thread

import requests
from rich.console import Console

console = Console().print


class MultiThreadRequest(Thread):
    def __init__(self, func, args=()):
        super(MultiThreadRequest, self).__init__()
        self.func = func
        self.args = args

    def run(self) -> None:
        self.result = self.func(*self.args)

    def get_result(self):
        try:
            return self.result
        except Exception as e:
            return e.args[0]


def get_days(begin_date: str = "2022-10-26"):
    date_list = []
    _begin_date: datetime = datetime.strptime(begin_date, "%Y-%m-%d")
    end_date: datetime = datetime.strptime(
        time.strftime("%Y-%m-%d", time.localtime(time.time())), "%Y-%m-%d"
    )
    while _begin_date <= end_date:
        date_str = _begin_date.strftime("%Y-%m-%d")
        date_list.append(date_str)
        _begin_date += timedelta(days=1)
    return date_list


def get_bing_data(day: str):
    ymd = day.split("-")
    # https://mouday.github.io/wallpaper-database/2024/03/20.json
    res = requests.get(
        f"https://mouday.github.io/wallpaper-database/{ymd[0]}/{ymd[1]}/{ymd[2]}.json"
    )
    if res.ok:
        return day, res.status_code, res.json()
    else:
        console(day, res.ok)
        return day, res.status_code, {}


def run():
    days = get_days()  # ['2022-10-26', '2022-10-27', ...]
    tasks = list()
    results = []
    for day in days:
        t = MultiThreadRequest(get_bing_data, args=(day,))
        tasks.append(t)
        t.start()

    for t in tasks:
        t.join()
        result = t.get_result()
        if result[1] != 200:
            pass
        else:
            result[2]["date"] = result[2].get("date", result[0]).replace("-", "/")
            results.append(result[2])
    # console(results)
    # src/resources/bing_wallpaper.json
    src = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.dirname(os.getcwd())))
    )
    with open(
        src + "/resources/bing_wallpaper.json",
        "w",
        encoding="utf-8",
    ) as f:
        for i in results:
            if i.get("image_url"):
                image_url = i["image_url"]
                res = requests.get(image_url)
                if res.ok:
                    image_name = image_url.split("id=")[1]
                    with open(
                        os.path.dirname(src) + f"/public/images/{image_name}", "wb"
                    ) as image_file:
                        image_file.write(res.content)
                    i["url"] = f"/images/{image_name}"
        json.dump(results, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    run()
