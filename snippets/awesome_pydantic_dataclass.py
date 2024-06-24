"""
Pydantic系列之 dataclass

dataclass 可以让你像 Pydantic 的 BaseModel 一样进行数据校验。
"""

import dataclasses
from datetime import datetime
from typing import Any, Dict, Generic, List, Optional, TypeVar

import pydantic
from pydantic import (
    AnyUrl,
    BaseModel,
    ConfigDict,
    Field,
    TypeAdapter,
    ValidationError,
    model_validator,
)

# from pydantic.dataclasses import dataclass
from pydantic.errors import PydanticSchemaGenerationError

"""
1、使用Field进行字段校验，使用TypeAdapter查看类的json schema结构
"""


@pydantic.dataclass
class User:
    id: int
    name: str = "John Doe"
    friends: List[int] = dataclasses.field(default_factory=lambda: [0])
    age: Optional[int] = dataclasses.field(
        default=None,
        metadata=dict(title="The age of the user", description="do not lie!"),
    )
    height: Optional[int] = Field(None, title="The height in cm", ge=50, le=300)


user = User(id="42")
print(TypeAdapter(User).json_schema())
"""
{
    'properties': {
        'id': {'title': 'Id', 'type': 'integer'},
        'name': {'default': 'John Doe', 'title': 'Name', 'type': 'string'},
        'friends': {
            'items': {'type': 'integer'},
            'title': 'Friends',
            'type': 'array',
        },
        'age': {
            'anyOf': [{'type': 'integer'}, {'type': 'null'}],
            'default': None,
            'description': 'do not lie!',
            'title': 'The age of the user',
        },
        'height': {
            'anyOf': [
                {'maximum': 300, 'minimum': 50, 'type': 'integer'},
                {'type': 'null'},
            ],
            'default': None,
            'title': 'The height in cm',
        },
    },
    'required': ['id'],
    'title': 'User',
    'type': 'object',
}
"""

"""
2、数据类配置 config
如果您想要像使用 Basemodel那样修改 Config，您有两种选择：
1、将配置作为字典应用到数据类装饰器
2、用作 ConfigDict 配置
"""


# Option 1 - use directly a dict
# Note: `mypy` will still raise typo error
@pydantic.dataclass(config=dict(validate_assignment=True))
class MyDataclass1:
    a: int


# Option 2 - use `ConfigDict`
# (same as before at runtime since it's a `TypedDict` but with intellisense)
@pydantic.dataclass(config=ConfigDict(validate_assignment=True))
class MyDataclass2:
    a: int


"""
3、数据类嵌套
"""


@pydantic.dataclass
class NavbarButton:
    href: AnyUrl


@pydantic.dataclass
class Navbar:
    button: NavbarButton


navbar = Navbar(button={"href": "https://example.com"})
print(navbar)
# > Navbar(button=NavbarButton(href=Url('https://example.com/')))

"""
4、通用数据类
Pydantic 支持通用数据类，包括具有类型变量的数据类。
"""


T = TypeVar("T")


@pydantic.dataclass
class GenericDataclass(Generic[T]):
    x: T


validator = TypeAdapter(GenericDataclass)

assert validator.validate_python({"x": None}).x is None
assert validator.validate_python({"x": 1}).x == 1
assert validator.validate_python({"x": "a"}).x == "a"

"""
5、初始化hooks
Pydantic dataclasses 内部的校验顺序如下：
(1)、model_validator(mode='before')
(2)、field_validator(mode='before')
(3)、field_validator(mode='after')
(4)、Inner validators. e.g. validation for types like int, str, ...
(5)、__post_init__.
(6)、model_validator(mode='after')
"""


@pydantic.dataclass
class Birth:
    year: int
    month: int
    day: int


@pydantic.dataclass
class User:
    birth: Birth

    @model_validator(mode="before")
    def pre_root(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        print(f"First: {values}")
        """
        First: ArgsKwargs((), {'birth': {'year': 1995, 'month': 3, 'day': 2}})
        """
        return values

    @model_validator(mode="after")
    def post_root(self) -> "User":
        print(f"Third: {self}")
        # > Third: User(birth=Birth(year=1995, month=3, day=2))
        return self

    def __post_init__(self):
        print(f"Second: {self.birth}")
        # > Second: Birth(year=1995, month=3, day=2)


user = User(**{"birth": {"year": 1995, "month": 3, "day": 2}})
print(user)

"""
6、Stdlib dataclasses and Pydantic dataclasses
(1)、继承 stdlib dataclasses
Stdlib的dataclasses 能够被继承，Pydantic会自动校验所有继承的属性名。

(2)、stdlib dataclasses被用于 BaseModel 中
在与Pydantic BaseModel混合时，stdlib 数据类（嵌套或非嵌套）会自动转换为 Pydantic 数据类。生成的 Pydantic 数据类将具有与原始数据类完全相同的配置（order、frozen、 ...）。

(3)、使用自定义类型
由于stdlib数据类会自动转换以添加验证，因此使用自定义类型可能会导致一些意外的行为。在这种情况下，您只需添加 arbitrary_types_allowed 配置即可！

(4)、类型校验
Pydantic 数据类仍然被视为数据类，因此 dataclasses.is_dataclass 将返回True。要检查类型是否是特定的 pydantic 数据类，可以使用 pydantic.dataclasses.is_pydantic_dataclass.
"""
#################################################
# Demo1：用于演示stdlib dataclasses被继承的例子
#################################################


@dataclasses.dataclass
class Z:
    z: int


@dataclasses.dataclass
class Y(Z):
    y: int = 0


@pydantic.dataclasses.dataclass
class X(Y):
    x: int = 0


foo = X(x=b"1", y="2", z="3")
print(foo)
# > X(z=3, y=2, x=1)

try:
    X(z="pika")
except ValidationError as e:
    print(e)
    """
    1 validation error for X
    z
      Input should be a valid integer, unable to parse string as an integer [type=int_parsing, input_value='pika', input_type=str]
    """
##################################################################
# Demo2：用于演示stdlib dataclasses作为BaseModel中一个字段进行使用
##################################################################


@dataclasses.dataclass(frozen=True)
class User:
    name: str


@dataclasses.dataclass
class File:
    filename: str
    last_modification_time: Optional[datetime] = None


class Foo(BaseModel):
    # Required so that pydantic revalidates the model attributes
    model_config = ConfigDict(revalidate_instances="always")

    file: File
    user: Optional[User] = None


file = File(
    filename=["not", "a", "string"],
    last_modification_time="2020-01-01T00:00",
)  # nothing is validated as expected
print(file)
"""
File(filename=['not', 'a', 'string'], last_modification_time='2020-01-01T00:00')
"""

try:
    Foo(file=file)
except ValidationError as e:
    print(e)
    """
    1 validation error for Foo
    file.filename
      Input should be a valid string [type=string_type, input_value=['not', 'a', 'string'], input_type=list]
    """

foo = Foo(file=File(filename="myfile"), user=User(name="pika"))
try:
    foo.user.name = "bulbi"
except dataclasses.FrozenInstanceError as e:
    print(e)
    # > cannot assign to field 'name'
#######################################################################################
# Demo3：自定义类型的演示
#######################################################################################


class ArbitraryType:
    def __init__(self, value):
        self.value = value

    def __repr__(self):
        return f"ArbitraryType(value={self.value!r})"


@dataclasses.dataclass
class DC:
    a: ArbitraryType
    b: str


# valid as it is a builtin dataclass without validation
my_dc = DC(a=ArbitraryType(value=3), b="qwe")

try:

    class Model(BaseModel):
        dc: DC
        other: str

    # invalid as it is now a pydantic dataclass
    Model(dc=my_dc, other="other")
except PydanticSchemaGenerationError as e:
    print(e.message)
    """
    Unable to generate pydantic-core schema for <class '__main__.ArbitraryType'>. Set `arbitrary_types_allowed=True` in
    the model_config to ignore this error or implement `__get_pydantic_core_schema__` on your type to fully support it.

    If you got this error by calling handler(<some type>) within `__get_pydantic_core_schema__` then you likely need to
    call `handler.generate_schema(<some type>)` since we do not call `__get_pydantic_core_schema__` on `<some type>`
    otherwise to avoid infinite recursion.
    """


class Model(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    dc: DC
    other: str


m = Model(dc=my_dc, other="other")
print(repr(m))
# > Model(dc=DC(a=ArbitraryType(value=3), b='qwe'), other='other')


#################################################
# Demo4：dataclass 类型校验
#################################################


@dataclasses.dataclass
class StdLibDataclass:
    id: int


PydanticDataclass = pydantic.dataclasses.dataclass(StdLibDataclass)

print(dataclasses.is_dataclass(StdLibDataclass))
# > True
print(pydantic.dataclasses.is_pydantic_dataclass(StdLibDataclass))
# > False

print(dataclasses.is_dataclass(PydanticDataclass))
# > True
print(pydantic.dataclasses.is_pydantic_dataclass(PydanticDataclass))
# > True
