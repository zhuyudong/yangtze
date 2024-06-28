"""PYTHONPATH=. python tests/awesome_scheduler_Celery.py"""

from celery import Celery

# FIXME
app = Celery("tasks", broker="pyamqp://guest@localhost//")


@app.task
def do_task():
    print("do_task...")


app.conf.beat_schedule = {
    "add-every-5-seconds": {
        "task": "tasks.do_task",
        "schedule": 5.0,
    }
}

if __name__ == "__main__":
    """
    pip install celery
    """

    app.worker_main()
