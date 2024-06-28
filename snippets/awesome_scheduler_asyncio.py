"""PYTHONPATH=. python tests/awesome_scheduler_asyncio.py"""

if __name__ == "__main__":
    import asyncio

    async def async_task():
        await asyncio.sleep(1)
        print("async_task...")

    # step 1: define a coroutine
    async def do_task():
        while True:
            print("do_task...")
            await async_task()
            await asyncio.sleep(5)

    # step 2: create an event loop
    loop = asyncio.get_event_loop()
    # step 3: schedule the coroutine to run
    loop.create_task(do_task())

    # step 4: run the event loop
    loop.run_forever()
