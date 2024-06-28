"""PYTHONPATH=. python tests/awesome_scheduler_threading.py"""

if __name__ == "__main__":
    import threading
    import time

    # step 1: define a task
    def task_to_execute():
        # NOTE：thread start 时会先执行一次，先于 main thread 执行
        print("Executing task in a seqarate thread...")

    # step 2: create a thread
    thread = threading.Thread(target=task_to_execute)
    # step 3: start the thread
    thread.start()

    while True:
        print("Doing something in the main thread...")
        time.sleep(5)
