"""
装饰器：修改函数行为的函数
  - 装饰器是函数
  - 装饰器接受一个函数作为参数
  - 装饰器返回一个新函数，通常是原函数的增强版本
  - 装饰器可以在不修改原函数的情况下，增加新的功能
应用场景：
  - 认证和授权
  - 缓存
  - 记录和日志
  - 输入验证
  - 事物管理
  - 性能优化
  - 错误处理
  - 类方法修饰
"""
import contextlib
import functools
import time
from typing import Callable, ClassVar

# def welcome():
#     return "Welcome to Python"


def decorate_welcome(func: Callable[[], str]) -> Callable[[], str]:
    def wrapper():
        return "********\n" + func() + "\n********"

    return wrapper


@decorate_welcome
def welcome():
    return "Welcome to Python"


ret = welcome()
print(">>>line39: \n", ret)

################################################################
# 常用装饰器
################################################################


# NOTE: @staticmethod - 静态方法
class MyClass:
    @staticmethod
    def static_method():
        print(">>>line50: ", "This is a static method")


MyClass.static_method()  # This is a static method


# NOTE: @classmethod，类方法的第一个参数是类本身
class MyClass:
    class_variable: ClassVar[int] = 0

    def __init__(self, value: int) -> None:
        self.instance_variable = value

    @classmethod
    def class_method(cls):
        cls.class_variable += 1


obj1 = MyClass(1)
obj2 = MyClass(2)
MyClass.class_method()
MyClass.class_method()
print(">>>line72: ", MyClass.class_variable)  # 2


# NOTE: @property - 将一个方法转换为方法属性一样调用
class Circle:
    _radius: ClassVar[int] = 0

    def __init__(self, radius: int) -> None:
        self._radius = radius

    @property
    def diameter(self) -> int:
        return self._radius * 2


circle = Circle(5)
print(">>>line88: ", circle.diameter)  # 10


################################################################
# 自定义装饰器
################################################################
def repeat(num_times: int):
    def decorator_repeat(func: Callable[[], str]) -> Callable[[], str]:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                print(func(*args, **kwargs))

        return wrapper

    return decorator_repeat


@repeat(num_times=3)
def greet(name: str) -> str:
    return "Hello, " + name + "!"


"""
Hello, Alice!
Hello, Alice!
Hello, Alice!
"""
greet("Alice")


################################################################
# 堆叠多个装饰器
################################################################
def decorator1(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("Decorator 1: Before function execution")
        result = func(*args, **kwargs)
        print("Decorator 1: After function execution")
        return result

    return wrapper


def decorator2(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("Decorator 2: Before function execution")
        result = func(*args, **kwargs)
        print("Decorator 2: After function execution")
        return result

    return wrapper


# NOTE: 多个装饰器的注册顺序是从上向下进入，执行顺序是从下往上执行
"""
Decorator 1: Before function execution
Decorator 2: Before function execution
Function is executed
Decorator 2: After function execution
Decorator 1: After function execution
"""


@decorator1
@decorator2
def greet():
    print("Function is executed")


greet()


################################################################
# 上下文管理器的使用
################################################################
@contextlib.contextmanager
def my_context_manager():
    print("Before")
    yield
    print("After")


"""
Before
Hello
After
"""
with my_context_manager():
    print("Hello")


################################################################
# functools 的使用
################################################################
# NOTE: @functools.wraps
def my_decorator(func: Callable[[], None]):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("Something is happening before the function is called.")
        result = func()
        print("Something is happening after the function is called.")
        return result

    return wrapper


@my_decorator
def say_hello():
    """Say hello to everyone"""
    print("Hello!")


"""
Something is happening before the function is called.
Hello!
Something is happening after the function is called.
"""
say_hello()
# NOTE: 使用 functools.wraps 修复装饰器的元数据, 例如函数名和文档字符串，如果不加 @functools.wraps，__name__ 会输出 wrapper
print(">>>line209: ", say_hello.__name__)  # say_hello
# NOTE：文档字符串
print(">>>line211: ", say_hello.__doc__)  # Say hello to everyone
# TODO: @functools.lru_cache

# TODO: @functools.singledispatch

# TODO: @functools.total_ordering

# TODO: @functools.cached_property

# TODO: @functools.partial

# TODO: @functools.partialmethod

# TODO: @functools.lru_cache

################################################################
# 常用装饰器
################################################################


# NOTE: 模拟耗时操作
def measure_time(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} executed in {end_time - start_time:.4f} seconds")
        return result

    return wrapper


@measure_time
def time_consuming_function():
    time.sleep(2)


time_consuming_function()


# NOTE: 缓存
def cache(func):
    cached_results = {}

    def wrapper(*args):
        if args in cached_results:
            print(f"Cache hit for {func.__name__}({args})")
            return cached_results[args]
        result = func(*args)
        cached_results[args] = result
        print(f"Cache miss for {func.__name__}({args}), result cached")
        return result

    return wrapper


@cache
def fibonacci(n):
    if n < 2:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)


fibonacci(5)


# NOTE: 认证和授权
def authenticate(username, password):
    authorized_users = {"user1": "password1", "user2": "password2"}
    if username in authorized_users and authorized_users[username] == password:
        return True
    else:
        return False


def requires_authentication(func):
    def wrapper(*args, **kwargs):
        username = input("Enter your username: ")
        password = input("Enter your password: ")
        if authenticate(username, password):
            return func(*args, **kwargs)
        else:
            return "Authentication failed. Access denied."

    return wrapper


@requires_authentication
def sensitive_info():
    return "This is sensitive information."


result = sensitive_info()
print(result)
