"""PYTHONPATH=. python tests/awesome_scheduler_rq.py"""

if __name__ == "__main__":
    """
    https://python-rq.org/
    pip install rq
    """

    # from datetime import datetime, timedelta

    import requests
    from redis import Redis
    from rq import Queue

    def do_task():
        print("do_task...")

    def count_words_at_url(url: str):
        print("do_task...")
        resp = requests.get(url)
        return len(resp.text.split())

    redis_client = Redis(host="localhost", port=6379)

    queue = Queue(connection=redis_client)
    # FIXME
    result = queue.enqueue(count_words_at_url, "http://nvie.com")

    # job = queue.enqueue_at(datetime(2024, 2, 1, 15, 4), do_task)
    # job = queue.enqueue_in(timedelta(seconds=5), do_task)
