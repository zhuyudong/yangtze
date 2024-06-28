"""PYTHONPATH=. python tests/awesome_scheduler_APScheduler.py"""

if __name__ == "__main__":
    """
    pip install apscheduler
    """
    from apscheduler.schedulers.blocking import BlockingScheduler

    # step 1: define task
    def do_task():
        print("do_task...")

    # step 2: define scheduler
    scheduler = BlockingScheduler()

    # step 3: add task to scheduler
    scheduler.add_job(do_task, "interval", seconds=5)  # minutes=1

    try:
        # step 4: start scheduler
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass
