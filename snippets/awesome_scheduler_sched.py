"""PYTHONPATH=. python tests/awesome_scheduler_sched.py"""

if __name__ == "__main__":
    import sched
    import time

    # step 1: define task
    def do_task():
        print("do_task...")

    # step 2: define scheduler
    s = sched.scheduler(time.time, time.sleep)

    while True:
        # step 3: add task to scheduler
        # s.enter(delay, priority, action, argument=())
        s.enter(5, 1, do_task, ())
        # step 4: start scheduler
        s.run()
