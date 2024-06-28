"""PYTHONPATH=. python tests/awesome_scheduler_time.py"""

if __name__ == "__main__":
    """
    sleep 时无法执行其他任务
    """
    import time

    # step 1: define task
    def do_task():
        print("do_task...")

    while True:
        # step 2: add task to scheduler
        time.sleep(5)
        # step 3: start scheduler
        do_task()
