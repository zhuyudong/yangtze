"""
Pydantic 系列之 validator

1、四种 validator
Pydantic 提供了四种 validator

    BeforeValidator
        运行在 Pydantic 内部的校验转换之前，入参为输入值Any，返回值为Any。
    AfterValidator
        运行在 Pydantic 内部的校验转换之后，入参和返回值为正确的字段类型。
    PlainValidator
        运行时间和 BeforeValidator相同，但执行完之后整个校验过程结束，不再执行其他 validator 和 Pydantic 内部的校验流程。
    WrapValidator
        可以运行在 pydantic 和其他 validator 之前或者之后，或者返回值、抛出异常立即结束校验流程。
        可以使用多个 BeforeValidator、AfterValidator 和 WrapperValidator，但是只能有一个 PlainValidator。

NOTE: 关于执行顺序，从右到左执行所有Before和Wrap校验器，再从左到右执行所有After校验器。
"""

from typing import Any, Literal

from pydantic import (
    BaseModel,
    Field,
    InstanceOf,
    SkipValidation,
    ValidationError,
    ValidationInfo,
    field_validator,
    model_validator,
)
from pydantic.functional_validators import (
    AfterValidator,
    BeforeValidator,
    WrapValidator,
)
from pydantic_core import PydanticCustomError
from pydantic_core.core_schema import ValidatorFunctionWrapHandler
from typing_extensions import Annotated


######
# Demo1: Validator
######
def check_squares(v: int) -> int:
    print("square: " + str(v))
    assert v**0.5 % 1 == 0, f"{v} is not a square number"
    return v


def double(v: Any) -> Any:
    print("double")
    return v * 2


def maybe_strip_whitespace(
    v: Any, handler: ValidatorFunctionWrapHandler, info: ValidationInfo
) -> int:
    print("wrap")
    if not isinstance(v, int):
        v = int(v)
    if v >= 22:
        try:
            # NOTE: 执行后续校验器链
            return handler(v)
        except ValidationError as e:
            print(e)
            return handler(v / 2)
    # 直接返回，结束校验
    return v


MyNumber = Annotated[
    int,
    AfterValidator(check_squares),
    WrapValidator(maybe_strip_whitespace),
    BeforeValidator(double),
]


class DemoModel(BaseModel):
    number: list[MyNumber]


print(DemoModel(number=[8, "2"]))
"""
double
wrap
double
wrap
square: 22
1 validation error for ValidatorCallable
  Assertion failed, 22 is not a square number [type=assertion_error, input_value=22, input_type=int]
    For further information visit https://errors.pydantic.dev/2.6/v/assertion_error
square: 11
Traceback (most recent call last):
  File "/home/qj00302/PycharmProjects/pythonProject/test_validator.py", line 45, in <module>
    print(DemoModel(number=[8, '2']))
          ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/qj00302/PycharmProjects/pythonProject/venv/lib/python3.11/site-packages/pydantic/main.py", line 171, in __init__
    self.__pydantic_validator__.validate_python(data, self_instance=self)
pydantic_core._pydantic_core.ValidationError: 1 validation error for DemoModel
number.1
  Assertion failed, 11 is not a square number [type=assertion_error, input_value=11.0, input_type=float]
    For further information visit https://errors.pydantic.dev/2.6/v/assertion_error

Demo结果解析：
输入给number的是一个【8，’2’】的列表，在DemoModel中，number列表中的每一个元素是MyNumber类型的，MyNumber是由Annotated生成的自定义数据类型，Annotated
内部可以包含多个验证器，验证从右到左然后再返回。也就是说，它从右到左运行所有“之前”验证器（或调用“包装”验证器），如果遇到遇到或者抛出异常就退出验证，否则再从左到
右退出调用所有“之后”验证器。
因此，number的第一个元素8，先经过BeforeValidator验证器，然后再经过WrapValidator验证器，由于16小于22，所以执行return退出完成第一个元素的验证。
number的第二个元素’2’，经过BeforeValidator验证器，返回‘22’，然后再经过WrapValidator验证器，由于22等于22，会执行后续验证器AfterValidator，在AfterValidator
验证器中由于22不是平方数，会抛出异常，这个异常会被上一层WrapValidator验证器中的try...catch捕获，然后在catch中会折半以后继续执行后续的AfterValidator验证器，再次执行时，
由于11也不是个平方数，所以抛出异常，验证终止。
"""

"""
2、field_validator 字段验证器
field_validator 可以是 Before 或者 AfterValidator（默认）。
被 field_validator 装饰的方法变成类方法（返回了classmethod），被装饰方法第一个参数是当前Model类，第二个参数为待校验的值，如果有第三个参数，则是pydantic.FieldValidationInfo，校验信息。
@field_validator 可变参数是要校验的字段名，可以是多个，'*'表示所有字段。
check_fields 关键字参数，检验字段是否存在在对象身上。
要么抛出 ValidationError 和 AssertionError，要么返回处理过的值。
"""


fields = ("name", "classname")


class UserModel(BaseModel):
    type: Literal["manual", "scheduled", "trigger"] = "manual"
    id: int
    name: str
    classname: str

    @field_validator("name")
    @classmethod
    def name_must_contain_space(cls, v: str) -> str:
        if " " not in v:
            raise ValueError("must contain a space")
        return v.title()

    # NOTE: you can select multiple fields, or use '*' to select all fields
    @field_validator("id", *fields)
    @classmethod
    def check_alphanumeric(cls, v: str, info: ValidationInfo) -> str:
        print(info)
        if isinstance(v, str):
            # info.field_name is the name of the field being validated
            is_alphanumeric = v.replace(" ", "").isalnum()
            assert is_alphanumeric, f"{info.field_name} must be alphanumeric"
        return v


try:
    print(UserModel(name="John Doe!", id=1, classname="1", type="scheduled"))
except ValidationError as e:
    print(e)
"""
ValidationInfo(config={'title': 'UserModel'}, context=None, data={'type': 'scheduled'}, field_name='id')
ValidationInfo(config={'title': 'UserModel'}, context=None, data={'type': 'scheduled', 'id': 1}, field_name='classname')
ValidationInfo(config={'title': 'UserModel'}, context=None, data={'type': 'scheduled', 'id': 1, 'classname': '1'}, field_name='name')
1 validation error for UserModel
name
  Assertion failed, name must be alphanumeric [type=assertion_error, input_value='John Doe!', input_type=str]
    For further information visit https://errors.pydantic.dev/2.6/v/assertion_error

Demo结果解析：
被field_validator装饰器修饰的方法会升级成 classmethod，name_must_contain_space 方法是为了验证UserModel模型中的name属性字段，check_alphanumeric方法是一个
验证模型中多个属性字段的例子，从打印的 ValidationInfo 中的信息来看，在对多个字段进行验证时，验证顺序和模型中定义的顺序有关。在验证中，如果被验证的值和预期不一致，则会抛出
AssertionError 或者 ValueError异常，程序终止。
"""

"""
3、@model_validator 模型验证器
model_validator 可以是 mode=‘before’, mode=‘after’ or mode=‘wrap’。
mode=‘before’，装饰的方法是一个类方法，第一个参数是cls类，第二个参数是 Dict[str, Any]，即原始输入（如果没有被model='wrap’修改的话），第三个参数（如果有）是ValidationInfo，
返回值是 Dict[str, Any]。
mode=‘after’，在validator和pydantic校验完成之后调用，是实例方法，只有一个参数self，此时属性已在实例对象上。
mode=‘wrap’，类方法，在before之前被调用，第一个参数是cls，第二个参数是原始输入Dict[str, Any]，第三个参数是ValidatorCallable校验器链，接受一个参数执行后续校验流程，
第四个参数是ValidationInfo。
"""


class UserModel(BaseModel):
    username: str
    password1: str
    password2: str

    @model_validator(mode="before")
    @classmethod
    def check_card_number_omitted(cls, data: Any) -> Any:
        if isinstance(data, dict):
            assert "card_number" not in data, "card_number should not be included"
        return data

    @model_validator(mode="after")
    def check_passwords_match(self) -> "UserModel":
        pw1 = self.password1
        pw2 = self.password2
        if pw1 is not None and pw2 is not None and pw1 != pw2:
            raise ValueError("passwords do not match")
        return self


print(UserModel(username="scolvin", password1="zxcvbn", password2="zxcvbn"))
# > username='scolvin' password1='zxcvbn' password2='zxcvbn'
try:
    UserModel(username="scolvin", password1="zxcvbn", password2="zxcvbn2")
except ValidationError as e:
    print(e)
    """
    1 validation error for UserModel
      Value error, passwords do not match [type=value_error, input_value={'username': 'scolvin', '... 'password2': 'zxcvbn2'}, input_type=dict]
    """

try:
    UserModel(
        username="scolvin",
        password1="zxcvbn",
        password2="zxcvbn",
        card_number="1234",
    )
except ValidationError as e:
    print(e)
    """
    1 validation error for UserModel
      Assertion failed, card_number should not be included
    assert 'card_number' not in {'card_number': '1234', 'password1': 'zxcvbn', 'password2': 'zxcvbn', 'username': 'scolvin'}
     [type=assertion_error, input_value={'username': 'scolvin', '..., 'card_number': '1234'}, input_type=dict]
    """
"""
Demo 结果解析：
在模型验证器传递原始输入之前，原始输入通常是 adict[str, Any]但也可以是模型本身的实例,可以将任意对象传递到model_validate。因此，mode='before'验证器
非常灵活且功能强大，但实施起来可能很麻烦且容易出错。在模型验证器之前应该是类方法。第一个参数应该是cls（我们还建议您@classmethod在下面使用@model_validator
以进行正确的类型检查），第二个参数将是输入（您通常应该将其键入为Any并用于isinstance缩小类型），第三个参数（如果存在）将是A pydantic.ValidationInfo。
mode='after'验证器是实例方法，并且始终接收模型的实例作为第一个参数。请务必在验证器结束时返回实例。您不应该使用(cls, ModelType)作为签名，而只是使用并
让类型检查器为您(self)推断类型。self由于它们是完全类型安全的，因此它们通常比验证器更容易实现mode='before'。如果任何字段验证失败，mode='after'则不会调用该字段的验证器。
"""

"""
4、Special Types 特殊验证类型
Pydantic 提供了一些可用于自定义验证的特殊类型。这里主要介绍两种
InstanceOf是一种类型，可用于验证值是否是给定类的实例。
SkipValidation是一种可用于跳过字段验证的类型。
"""


class Fruit:
    def __repr__(self):
        return self.__class__.__name__


class Banana(Fruit): ...


class Apple(Fruit): ...


class Basket(BaseModel):
    fruits: list[InstanceOf[Fruit]]


print(Basket(fruits=[Banana(), Apple()]))
# > fruits=[Banana, Apple]
try:
    Basket(fruits=[Banana(), "Apple"])
except ValidationError as e:
    print(e)
"""
fruits=[Banana, Apple]
1 validation error for Basket
fruits.1
  Input should be an instance of Fruit [type=is_instance_of, input_value='Apple', input_type=str]
    For further information visit https://errors.pydantic.dev/2.6/v/is_instance_of

Demo结果解析：
对于第一个print(Basket(fruits=[Banana(), Apple()])),因为Banana和Apple都是Fruit，所以正常输出Basket数据模型中的fruits。
对于第二个Basket(fruits=[Banana(), "Apple"])模型赋值的过程，由于“Apple”是一个字符串，不是Fruit类型的，所以校验时抛出异常
"""


class Model(BaseModel):
    names: list[SkipValidation[str]]


m = Model(names=["foo", "bar"])
print(m)
# > names=['foo', 'bar']

m = Model(names=["foo", 123])
print(m)
# > names=['foo', 123]
"""
Demo 结果解析：
虽然 123 不是 str 类型的，但是使用了 SkipValidation 这个特殊验证类型，因此也可以正常赋值。
"""

"""
5、默认值验证
使用默认值时验证器将不会运行。这既适用于@field_validator验证者，也适用于Annotated验证者。如果想要对默认值进行验证，可以使用Field(validate_default=True)
"""


class Model(BaseModel):
    x: str = "abc"
    y: Annotated[str, Field(validate_default=True)] = "xyz"

    @field_validator("x", "y")
    @classmethod
    def double(cls, v: str) -> str:
        return v * 2


print(Model())
# > x='abc' y='xyzxyz'
print(Model(x="foo"))
# > x='foofoo' y='xyzxyz'
"""
Demo结果解析：
默认情况下，不会校验字段x的默认值。因此第一个无参赋值，x的值为默认值“abc”，y字段声明了要校验默认值，因此会执行验证器逻辑，最终输出'xyzxyz'
对于第二个只有一个参数的构造函数初始化，会进行x字段的验证器校验，因此x输出'foofoo'，y字段同理。
"""


"""
6、处理验证器中的异常
正如前面几节中提到的，您可以在验证器中引发或ValueError（AssertionError包括由assert ...语句生成的）来指示验证失败。
您还可以提出一个PydanticCustomError有点冗长但给您额外的灵活性的问题。任何其他错误（包括TypeError）都会冒泡出来，并且不会包含在ValidationError.
"""


class Model(BaseModel):
    x: int

    @field_validator("x")
    @classmethod
    def validate_x(cls, v: int) -> int:
        if v % 42 == 0:
            raise PydanticCustomError(
                "the_answer_error",
                "{number} is the answer!",
                {"number": v},
            )
        return v


try:
    Model(x=42 * 2)
except ValidationError as e:
    print(e)
"""
Demo結果解析：
PydanticCustomError是對ValueError繼承封裝，使用PydanticCustomError可以把校驗錯誤描述的更詳細。
"""
