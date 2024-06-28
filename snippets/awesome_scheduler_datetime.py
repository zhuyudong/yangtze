"""PYTHONPATH=. python tests/awesome_scheduler_datetime.py"""

import time

if __name__ == "__main__":
    """
    sleep 时无法执行其他任务
    """
    import datetime

    # step 1: define task
    def do_task():
        current_time = datetime.datetime.now().time()
        schedule_time = datetime.time(hour=15, minute=27)
        # 比较时间，执行任务
        if current_time >= schedule_time:
            print("do_task...")

    while True:
        # step 2: run pending tasks
        do_task()
        # step 3: check task every 5 seconds
        time.sleep(5)
