"""PYTHONPATH=. python tests/awesome_scheduler_schedule.py"""

if __name__ == "__main__":
    """
    pip install schedule
    """
    import time

    import schedule

    # step 1: define task
    def do_task():
        print("do_task...")

    # step 2: define scheduler
    scheduler = schedule.Scheduler()
    # step 3: add task to scheduler
    scheduler.every(5).seconds.do(do_task)

    while True:
        # step 4: start scheduler
        scheduler.run_pending()
        time.sleep(1)
