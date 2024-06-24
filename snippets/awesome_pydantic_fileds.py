"""
Pydantic 系列之 Field
Field 函数用于自定义元数据并将其添加到模型的字段中。
"""

from decimal import Decimal
from typing import Literal, Union
from uuid import uuid4

from pydantic import (
    BaseModel,
    Discriminator,
    Field,
    Tag,
    ValidationError,
    computed_field,
)
from pydantic.dataclasses import dataclass
from typing_extensions import Annotated

"""
1、默认值
"""


class User(BaseModel):
    name: str = Field(default="John Doe")


user = User()
print(user)
# > name='John Doe'

"""
2、使用Annotated
"""


class User(BaseModel):
    id: Annotated[str, Field(default_factory=lambda: uuid4().hex)]


user = User()

print(user)

# > id='2925fb3cb6e9469d8139e08ae4f304aa'

"""
3、字段别名
定义别名的方法有以下三种：
Field(..., alias='foo')
Field(..., validation_alias='foo')
Field(..., serialization_alias='foo')
该alias参数用于验证和序列化。如果要分别使用不同的别名进行验证和序列化，可以使用validation_alias和serialization_alias参数，这仅适用于各自的用例。
"""


class User(BaseModel):
    name: str = Field(..., alias="username")


class User1(BaseModel):
    name: str = Field(..., validation_alias="username")


class User2(BaseModel):
    name: str = Field(..., serialization_alias="username")


user = User(username="johndoe")
print(user)
# > name='johndoe'
print(user.model_dump(by_alias=True))
# > {'username': 'johndoe'}

user1 = User1(username="johndoe")
print(user1)
# > name='johndoe'
print(user1.model_dump(by_alias=True))
# > {'name': 'johndoe'}

user2 = User2(name="johndoe")
print(user2)
# > name='johndoe'
print(user2.model_dump(by_alias=True))
# > {'username': 'johndoe'}

"""
4、数值约束
有一些关键字参数可用于约束数值：
gt- 比...更棒
lt- 少于
ge- 大于或等于
le- 小于或等于
multiple_of- 给定数字的倍数
allow_inf_nan- 允许'inf', '-inf','nan'值
"""


class Foo(BaseModel):
    positive: int = Field(gt=0)
    non_negative: int = Field(ge=0)
    negative: int = Field(lt=0)
    non_positive: int = Field(le=0)
    even: int = Field(multiple_of=2)
    love_for_pydantic: float = Field(allow_inf_nan=True)


foo = Foo(
    positive=1,
    non_negative=0,
    negative=-1,
    non_positive=0,
    even=4,
    love_for_pydantic=float("inf"),
)

print(foo)
"""
positive=1 non_negative=0 negative=-1 non_positive=0 even=4 love_for_pydantic=inf
"""

"""
5、字符串约束
有一些字段可用于约束字符串：

min_length：字符串的最小长度。
max_length：字符串的最大长度。
pattern：字符串必须匹配的正则表达式。

"""


class Foo(BaseModel):
    short: str = Field(min_length=3)
    long: str = Field(max_length=10)
    regex: str = Field(pattern=r"^\d*$")


foo = Foo(short="foo", long="foobarbaz", regex="123")
print(foo)
# > short='foo' long='foobarbaz' regex='123'

"""
6、小数约束
有一些字段可用于限制小数：

max_digits： 中的最大位数Decimal。它不包括小数点前的零或尾随小数点零。
decimal_places：允许的最大小数位数。它不包括尾随小数零。

"""


class Foo(BaseModel):
    precise: Decimal = Field(max_digits=5, decimal_places=2)


foo = Foo(precise=Decimal("123.45"))
print(foo)
# > precise=Decimal('123.45')

"""
7、数据类约束
有一些字段可用于约束数据类：

init：该字段是否应包含在__init__数据类中。
init_var：该字段是否应被视为数据类中的仅初始化字段。
kw_only：该字段是否应该是数据类构造函数中的仅关键字参数
"""


@dataclass
class Foo:
    bar: str
    baz: str = Field(init_var=True)
    qux: str = Field(kw_only=True)


class Model(BaseModel):
    foo: Foo


model = Model(foo=Foo("bar", baz="baz", qux="qux"))
print(model.model_dump())
# > {'foo': {'bar': 'bar', 'qux': 'qux'}}

"""
8、验证默认值
validate_default可用于控制是否应验证字段的默认值。
"""


class User(BaseModel):
    age: int = Field(default="twelve", validate_default=True)


try:
    user = User()
except ValidationError as e:
    print(e)
    """
    1 validation error for User
    age
      Input should be a valid integer, unable to parse string as an integer [type=int_parsing, input_value='twelve', input_type=str]
    """

"""
9、模型tostring
repr可用于控制该字段是否应包含在模型的字符串表示中。
"""


class User(BaseModel):
    name: str = Field(repr=True)
    age: int = Field(repr=False)


user = User(name="John", age=42)
print(user)
# > name='John'

"""
10、鉴别器
discriminator可用于控制用于区分Union中不同模型的字段。它接收的值要么是字段名称要么是Discriminator实例。Discriminator这个方法通常用于Union中的模型有不同的域名的场景
"""


class Cat(BaseModel):
    pet_type: Literal["cat"]
    age: int


class Dog(BaseModel):
    pet_type: Literal["dog"]
    age: int


class Model(BaseModel):
    pet: Cat | Dog = Field(discriminator="pet_type")


print(Model.model_validate({"pet": {"pet_type": "cat", "age": 12}}))
# > pet=Cat(pet_type='cat', age=12)

#################################################################################################################


class Cat(BaseModel):
    pet_type: Literal["cat"]
    age: int


class Dog(BaseModel):
    pet_kind: Literal["dog"]
    age: int


def pet_discriminator(v):
    if isinstance(v, dict):
        return v.get("pet_type", v.get("pet_kind"))
    return getattr(v, "pet_type", getattr(v, "pet_kind", None))


class Model(BaseModel):
    pet: Union[Annotated[Cat, Tag("cat")], Annotated[Dog, Tag("dog")]] = Field(
        discriminator=Discriminator(pet_discriminator)
    )


print(repr(Model.model_validate({"pet": {"pet_type": "cat", "age": 12}})))
# > Model(pet=Cat(pet_type='cat', age=12))

print(repr(Model.model_validate({"pet": {"pet_kind": "dog", "age": 12}})))
# > Model(pet=Dog(pet_kind='dog', age=12))

"""
Demo结果解析：
示例1：discriminator="pet_type"，表示根据字段属性的名称进行模型的选择并实例化。
示例2：Discriminator 这里示范了模型中字段名称不一致的情况下，如果选择Union中的不同类型并且初始化实例
"""

"""
11、strict 参数指定 Field 是否应在“严格模式”下验证该字段
"""


class User(BaseModel):
    name: str = Field(strict=True)
    age: int = Field(strict=False)


user = User(name="John", age="42")
print(user)
# > name='John' age=42

"""
12、排除
exclude参数可用于控制导出模型时应从模型中排除哪些字段。
"""


class User(BaseModel):
    name: str
    age: int = Field(exclude=True)


user = User(name="John", age=42)
print(user.model_dump())
# > {'name': 'John'}

"""
13、computed_field 装饰者
装饰 computed_field 器可用于在序列化模型或数据类时包含 property 或属性。cached_property 这对于从其他字段计算的字段或计算成本高昂（因此被缓存）的字段非常有用。
"""


class Box(BaseModel):
    width: float
    height: float
    depth: float

    @computed_field
    def volume(self) -> float:
        return self.width * self.height * self.depth


b = Box(width=1, height=2, depth=3)
print(b.model_dump())
# > {'width': 1.0, 'height': 2.0, 'depth': 3.0, 'volume': 6.0}
