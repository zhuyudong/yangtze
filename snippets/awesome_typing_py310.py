"""
PYTHONPATH=. mypy snippets/awesome_typing.py
mypy 类型检查工具
    https://mypy-lang.org/
    pip install mypy mypy-extensions sqlalchemy-stubs
    mypy.ini 或 setup.cfg mypy 的配置文件，命令行参数优先级高于配置文件
    mypy --help
    mypy snippets/awesome_typing.py
        Success: no issues found in 1 source file
        snippets/awesome_typing.py:386: error: Argument 1 to "Box" has incompatible type "str"; expected "int"  [arg-type]
Found 1 error in 1 file (checked 1 source file)
    mypy --strict snippets/awesome_typing.py
        Strict mode; enables the following flags: --warn-unused-configs, --disallow-any-generics,
            --disallow-subclassing-any, --disallow-untyped-calls,
            --disallow-untyped-defs, --disallow-incomplete-defs, --check-untyped-defs,
            --disallow-untyped-decorators, --warn-redundant-casts, --warn-unused-ignores,
            --warn-return-any, --no-implicit-reexport, --strict-equality, --extra-checks
    代码行尾加上 “# type: ignore” 可以忽略类型检查，注意 ignore 后面不要再加注释
"""

import collections
import re
from typing import (
    Annotated,
    Any,
    Callable,
    ClassVar,
    Counter,
    DefaultDict,
    Deque,
    Final,
    FrozenSet,
    Generator,
    Generic,
    Iterable,
    Iterator,
    Literal,
    Mapping,
    Match,
    MutableMapping,
    NamedTuple,
    NewType,
    NoReturn,
    Protocol,
    Sequence,
    Tuple,
    Type,
    TypedDict,
    TypeGuard,
    TypeVar,
)

################################################################
# 基本类型
################################################################


def get_int(x: int) -> int:
    return x * 2


def get_float(x: float) -> float:
    return x


def get_str(x: str) -> str:
    return x


def get_bool(x: bool) -> bool:
    return x


# NOTE: strict 模式下，需要详细 dict 内部的类型
# --strict Missing type parameters for generic type "dict"  [type-arg]
def get_dict(x: dict) -> dict:
    return x


# NOTE: 只接受 1, 2, "str1", "str2", True 五种值
def receive_literal(x: Literal[1, 2, "str1", "str2", True]) -> int | str | bool:
    return x


# NOTE: 传入 int 或 float 类型，返回 int 或 float 类型
def double_or_square(x: int | float) -> int | float:
    if isinstance(x, int):
        return x * 2
    else:
        return x**2


# NOTE: 传入 str 类型（可选）
def greet(name: str = None) -> str:
    if name is None:
        return "Hello, world"
    else:
        return "Hello, " + name


# NOTE: 接受任何类型的参数，返回任何类型的值
def get_anything(x: Any) -> Any:
    return x


def process_numbers(numbers: list[int]) -> Tuple[int, int]:
    return min(numbers), max(numbers)


def process_optional_numbers(
    numbers: list[int] = None,
) -> Tuple[int, int] | None:
    if numbers:
        return min(numbers), max(numbers)
    return None


################################################################
# 复杂类型
################################################################
# NOTE: set - 集合，无序，不重复
def get_unique_numbers(numbers: list[int]) -> set[int]:
    return set(numbers)


unique_numbers = get_unique_numbers([1, 2, 3, 1, 2, 3])
print(">>>line134: ", unique_numbers)  # {1, 2, 3}


# NOTE: FrozenSet - 不可变集合，不可添加或删除元素
def get_categories() -> FrozenSet[str]:
    return frozenset(["fruit", "vegetable", "meat"])


categories = get_categories()
print(">>>line143: ", categories)  # frozenset({'fruit', 'vegetable', 'meat'})
# categories.add("snack")  # AttributeError: 'frozenset' object has no attribute 'add'


# NOTE: Deque - 双端队列，支持从两端添加和弹出元素
def get_buffer() -> Deque[int]:
    return collections.deque(maxlen=5)


buffer = get_buffer()
for i in range(5):
    buffer.append(i)
    print(">>>line155: ", list(buffer))


# NOTE: DefaultDict - 为字典的值设置默认值
def get_word_count() -> DefaultDict[str, int]:
    return collections.defaultdict(int)


word_count = get_word_count()
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
for word in words:
    word_count[word] += 1
print(
    ">>>line160: ", word_count
)  # defaultdict(<class 'int'>, {'apple': 3, 'banana': 2, 'orange': 1})


# NOTE: Counter - 统计元素出现的次数，strict 模式下，需要详细 list 内部的类型
# --strict Missing type parameters for generic type "list"  [type-arg]
def count_elements(elements: list) -> Counter[str]:
    return collections.Counter(elements)


element_counts = count_elements(
    ["apple", "banana", "apple", "orange", "banana", "apple"]
)
print(">>>line181: ", element_counts)  # Counter({'apple': 3, 'banana': 2, 'orange': 1})


# NOTE: Generator - 生成器，惰性计算
def generate_numbers(n: int) -> Generator[int, None, None]:
    for i in range(n):
        yield i


# NOTE: Final - 不可变变量
class MyImmutableClass:
    CONSTANT: Final = 3.1415


immu = MyImmutableClass()
# immu.CONSTANT = 3.14  # AttributeError: 'MyImmutableClass' object attribute 'CONSTANT' is read-only


# NOTE: Annotated - 注解，为类型添加额外的信息
def speed_limit(speed: Annotated[int, "km/h"]) -> None:
    print(">>>line201: ", "Limit is", speed, "km/h")


speed_limit(100)  # Limit is 100 km/h


# NOTE: NamedTuple - 命名元组
# NOTE: Protocol - 定义方法的协议
class Flyer(Protocol):
    def fly(self) -> None:
        pass


class Bird:
    def fly(self) -> None:
        print(">>>line216: ", "Bird is flying")


def make_it_fly(flyer: Flyer) -> None:
    flyer.fly()


make_it_fly(Bird())  # Bird is flying
# make_it_fly(123)  # error: Argument 1 to "make_it_fly" has incompatible type "int"; expected "Flyer"
# NOTE: NewType - 创建新类型，增强类型安全性
UserId = NewType("UserId", int)


def get_user_name(user_id: UserId) -> str:
    return "Alice"


# NOTE: Match - 模式匹配，通常与 match 语句一起使用，仅 Python 3.10 及以上版本支持
def find_first_number(text: str) -> Match[str]:
    pattern = re.compile(r"\d+")
    match = pattern.search(text)
    if match:
        return match
    else:
        raise ValueError("No number found in the text")


match_result = find_first_number("Example with numbers 123 and 456")
print(">>>line244: ", match_result.group())  # 123


# NOTE: Type - 标注类对象本身
class Animal:
    pass


class Dog(Animal):
    pass


def create_animal(animal_class: Type[Animal]) -> Animal:
    return animal_class()


dog = create_animal(Dog)


# NOTE: NoReturn - 永不返回
def halt() -> NoReturn:
    raise RuntimeError("Program halted")


# NOTE: Iterator - 迭代器，Iterable - 可迭代对象
def iter_elements(elements: Iterable[int]) -> Iterator[int]:
    return iter(elements)


for element in iter_elements([1, 2, 3]):
    print(">>>line274: ", element)


# NOTE: Mapping - 映射，MutableMapping - 可变映射
def display_scores(scores: Mapping[str, int]) -> None:
    for name, score in scores.items():
        print(">>>line280: ", f"{name}: {score}")


scores_immutable: Mapping[str, int] = {"Alice": 10}
display_scores(scores_immutable)

scores_mutable: MutableMapping[str, int] = {"Alice": 10}
display_scores(scores_mutable)


# NOTE: Sequence - 序列，应该避免修改序列
def display_first_element(elements: Sequence[int]) -> None:
    if elements:
        print(">>>line293: ", elements[0])
    else:
        print(">>>line295: ", "Nothing to display")


# NOTE: ClassVar - 标注类变量
class MyClassVar:
    class_var: ClassVar[int] = 10

    def __init__(self, instance_var: int) -> None:
        self.instance_var = instance_var


# NOTE: NamedTuple - 创建具有固定结构的元组子类
class Employee(NamedTuple):
    name: str
    id: int
    department: str


emp = Employee("Alice", 123, "IT")


# NOTE: TypedDict - 类型字典，用于定义具有特定键和值类型的字典，其中每个键都有预期的类型
class Movie(TypedDict):
    name: str
    year: int
    rating: float
    watched: bool


movie: Movie = {"name": "The Matrix", "year": 1999, "rating": 8.7, "watched": True}
print(
    ">>>line313: ", movie
)  # {'name': 'The Matrix', 'year': 1999, 'rating': 8.7, 'watched': True}


# NOTE: TypeGuard - 类型保护
def is_str_list(val: list[object]) -> TypeGuard[list[str]]:
    return all(isinstance(x, str) for x in val)


def greet_all(names: list[object]) -> None:
    if is_str_list(names):
        for name in names:
            print(">>>line338: ", "Hello", name)


greet_all(["Charlie"])
################################################################
# 泛型
################################################################

T1 = TypeVar("T1")


def get_first_element(items: list[T1]) -> T1:
    return items[0]


first_element = get_first_element([1, 2, 3])


def apply_function(
    func: Callable[[int, int], int], numbers: Sequence[int]
) -> list[int]:
    return [func(num, num) for num in numbers]


# NOTE: 泛型约束
T2 = TypeVar("T2", int, float)


def add(a: T2, b: T2) -> T2:
    return a + b


add(1, 2)
add(1.5, 2.5)
# add("str", 2.5)  # error: Value of type variable "T2" of "add" cannot be "object"  [type-var]

# NOTE: 泛型类
T3 = TypeVar("T3")


class Box(Generic[T3]):
    def __init__(self, content: T3) -> None:
        self.content = content

    def get_content(self) -> T3:
        return self.content


box1 = Box[int](123)
print(">>>line387: ", box1.get_content())  # 123
# NOTE: 忽略警告
box2 = Box[int]("hello")  # type: ignore
# box2 = Box[int](
#     "hello"
# )  # error: Argument 1 to "Box" has incompatible type "str"; expected "int"  [arg-type]


################################################################
# 类型注解
################################################################
class MyClass:
    value: int

    def __init__(self, initial_value: int) -> None:
        self.value = initial_value

    def double_value(self) -> None:
        self.value *= 2


################################################################
# 递归类型注解
################################################################
Tree = list[int | dict[str, "Tree"]]
################################################################
# 类型别名
################################################################
# NOTE: IUserId 必须和 TypeVar 第一个参数相同
IUserId = TypeVar("IUserId", int, str)
IUsername = TypeVar("IUsername", str, bytes)


def get_user_details(
    user_id: IUserId, username: IUsername
) -> Tuple[IUserId, IUsername]:
    return user_id, username


get_user_details(1, "Alice")
get_user_details(
    True, b"Alice"
)  #  error: Value of type variable "IUserId" of "get_user_details" cannot be "Callable[[], True_]"  [type-var]
