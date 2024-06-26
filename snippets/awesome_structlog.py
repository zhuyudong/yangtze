"""
https://github.com/hynek/structlog/blob/main/show_off.py
PYTHONPATH=. python tests/test_structlog.py
"""

"""
Show how console logging looks like.

This is used for the screenshot in the readme and
<https://www.structlog.org/en/stable/development.html>.
"""

from dataclasses import dataclass  # noqa: E402

import structlog  # noqa: E402


@dataclass
class SomeClass:
    x: int
    y: str


structlog.stdlib.recreate_defaults()  # so we have logger names

log = structlog.get_logger("some_logger")

log.debug("debugging is hard", a_list=[1, 2, 3])
log.info("informative!", some_key="some_value")
log.warning("uh-uh!")
log.error("omg", a_dict={"a": 42, "b": "foo"})
log.critical("wtf", what=SomeClass(x=1, y="z"))


log2 = structlog.get_logger("another_logger")


def make_call_stack_more_impressive():
    try:
        d = {"x": 42}
        print(SomeClass(d["y"], "foo"))
    except Exception:
        log2.exception("poor me")
    log.info("all better now!", stack_info=True)


make_call_stack_more_impressive()
