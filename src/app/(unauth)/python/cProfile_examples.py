# import cProfile

from rich.console import Console

console = Console().print


# 常规版
def fib1(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fib1(n - 1) + fib1(n - 2)


# 改进版
def memoize(f):
    memo = {}

    def helper(x):
        if x not in memo:
            memo[x] = f(x)
        return memo[x]

    return helper


@memoize
def fib2(n):
    if n < 2:
        return n
    return fib2(n - 1) + fib2(n - 2)


def fib_seq(n):
    res = []
    if n > 0:
        res.extend(fib_seq(n - 1))
    res.append(fib2(n))
    return res


console(fib_seq(30))
# 等效于 python -m cProfile cProfile_examples.py
# cProfile.run("fib_seq(30)")
