import inspect
from typing import Callable, List

################################################################
# 函数定义与形态
################################################################
# 普通函数


def greet(name: str) -> str:
    return "Hello, " + name + "!"


message = greet("Alice")
print(">>>line15: ", message)


################################################################
# 函数参数
################################################################
def greet1(name: str, greeting: str) -> str:
    return greeting + ", " + name + "!"


# NOTE: 位置参数
greeting = greet1("Alice", "Hello")
# NOTE: 关键字参数
greeting = greet1(greeting="Hello", name="Alice")


# NOTE: 默认参数
def multiply(x: int, y: int = 2) -> int:
    return x * y


# NOTE: 可变参数
def sum_number(*args: int) -> int:
    # total = 0
    # for arg in args:
    #     total += arg
    # return total
    # NOTE: 使用内置函数 sum() 代替上面的循环
    return sum(args)


result = sum_number(1, 2, 3, 4, 5)
# 最后一个参数是浮点数，不能通过 mypy 检查
# error: Argument 10 to "sum_number" has incompatible type "float"; expected "int"  [arg-type]
result = sum_number(1, 2, 3, 4, 5, 6, 7, 8, 9, 10.123)  # type: ignore
print(">>>line50: ", result)  # 15


################################################################
# 函数文档字符串和函数签名
################################################################
def greet2(name: str, message: str) -> str:
    """
    通过给定的名称和消息创建一个问候语。

    参数：
    name (str): 要问候的名称。
    message (str): 问候消息。

    返回：
    str: 包含问候消息的字符串。
    """
    return message + ", " + name + "!"


# NOTE: 获取函数签名
signature = inspect.signature(greet2)
print(">>>line72: ", signature)  # >>>line70:  (name: str, message: str) -> str
for name, param in signature.parameters.items():
    """
    name <class 'str'> POSITIONAL_OR_KEYWORD <class 'inspect._empty'>
    message <class 'str'> POSITIONAL_OR_KEYWORD <class 'inspect._empty'>
    """
    print(">>>line78: ", name, param.annotation, param.kind, param.default)

################################################################
# Lambda 函数
################################################################
square = lambda x: x**2  # noqa: E731
print(">>>line84: ", square(3))  # 9


################################################################
# 内置函数
################################################################


################################################################
# 高阶函数：函数作为参数和返回值 http://ipengtao.com/1283.html
################################################################
def apply_function(func: Callable[[int, int], int], a: int, b: int) -> List[int]:
    result = []
    for item in range(a, b):
        # error: Too few arguments  [call-arg]
        result.append(func(item))  # type: ignore
    return result


# error: Cannot infer type of lambda  [misc]
squared_numbers: Callable[[int, int], List[int]] = apply_function(lambda x: x**2, 1, 10)  # type: ignore
print(">>>line105: ", squared_numbers)  # [1, 4, 9, 16, 25, 36, 49, 64, 81]


################################################################
# 闭包：函数的状态
################################################################
# NOTE: Callable[[参数类型], 返回值类型]
def counter() -> Callable[[], int]:
    count: int = 0

    def increment() -> int:
        # NOTE: nonlocal 指向外部作用于的变量
        nonlocal count
        count += 1
        return count

    return increment


counter_func = counter()
print(">>>line125: ", counter_func())  # 1
print(">>>line126: ", counter_func())  # 2
################################################################
# 内置函数 awesome_function_built-in.py
################################################################
################################################################
# 函数递归 http://ipengtao.com/440.html
################################################################
################################################################
# 装饰器：修改函数行为 awesom_decorator.py
################################################################

################################################################
# 使用技巧 http://ipengtao.com/1149.html
################################################################
