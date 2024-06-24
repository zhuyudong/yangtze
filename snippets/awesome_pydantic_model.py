"""
Pydantic 系列之 Model

1、基础模型BaseModel
Pydantic中的Model与 Python中的Dataclass有许多相似之处，但在设计上存在一些微妙但重要的差异，这些差异简化了与验证、序列化和 JSON 模式生成相关的某些工作流程。

Pydantic中的模型是继承BaseModel且定义了带注释属性的类，BaseModel是Pydantic中最基本的模型，它具有以下方法和属性：
    model_computed_fields：此模型实例的计算字段的字典。
    model_construct()：用于创建模型而不运行验证的类方法。请参阅 创建未经验证的模型。
    model_copy()：返回模型的副本（默认情况下为浅副本）。请参阅 序列化。
    model_dump()：返回模型字段和值的字典。请参阅 序列化。
    model_dump_json()：返回 的 JSON 字符串表示形式model_dump()。请参阅 序列化。
    model_extra：在验证期间设置额外的字段。
    model_fields_set：模型实例初始化时设置的字段集。
    model_json_schema()：返回一个 jsonable 字典，将模型表示为 JSON Schema。请参阅JSON 架构。
    model_parametrized_name()：计算泛型类参数化的类名。
    model_post_init()：模型初始化后执行额外的初始化。
    model_rebuild()：重建模型架构，也支持构建递归通用模型。请参阅重建模型架构。
    model_validate()：用于将任何对象加载到模型中的实用程序。请参阅辅助函数。
    model_validate_json()：用于根据 Pydantic 模型验证给定 JSON 数据的实用程序。请参阅 辅助函数。

除此之外，Pydantic的行为可以被BaseModel.model_config属性所控制。配置字典中一些常用的默认配置分别为：
   title：生成JSON模式的标题。
   str_to_lower：是否将str类型的所有字符转换为小写。默认为False.
   str_to_upper：是否将str类型的所有字符转换为大写。默认为False.
   str_strip_whitespace：是否去除str类型的前导和尾随空格。
   str_max_length：str类型的最大长度。默认为None.
   extra：您可以配置 pydantic 如何处理模型中未定义的属性：
        allow- 允许任何额外的属性。
        forbid- 禁止任何额外的属性。
        ignore- 忽略任何额外的属性。
   frozen：模型是否是faux-immutable，即是否__setattr__允许，并且还生成__hash__()模型的方法。
   如果所有属性都是可散列的，则这使得模型的实例可能是可散列的。默认为False.
   populate_by_name：别名字段是否可以通过模型属性给定的名称以及别名来填充。默认为False.
   use_enum_values：是否使用value枚举属性而不是原始枚举来填充模型。如果您想model.model_dump()稍后序列化，这可能很有用。默认为False.
   validate_assignment：如果用户在创建模型后更改数据，则不会重新验证模型。
   arbitrary_types_allowed：字段类型是否允许任意类型。默认为False.
   validate_default：验证期间是否验证默认值。默认为False.
"""

from typing import Dict, Generic, List, Optional, TypeVar

from pydantic import (
    BaseModel,
    PydanticUserError,
    RootModel,
    ValidationError,
    create_model,
)


class Foo(BaseModel):
    x: "Bar"


try:
    Foo.model_json_schema()
except PydanticUserError as e:
    print(e)
    """
    `Foo` is not fully defined; you should define `Bar`, then call `Foo.model_rebuild()`.

    For further information visit https://errors.pydantic.dev/2/u/class-not-fully-defined
    """


class Bar(BaseModel):
    pass


Foo.model_rebuild()
print(Foo.model_json_schema())
"""
{
    '$defs': {'Bar': {'properties': {}, 'title': 'Bar', 'type': 'object'}},
    'properties': {'x': {'$ref': '#/$defs/Bar'}},
    'required': ['x'],
    'title': 'Foo',
    'type': 'object',
}
"""
"""
Demo结果解析：
当调用最外层模型时，它构建了一个用于验证整个模型（嵌套模型和所有模型）的核心模式，因此各级所有类型都需要在调用model_rebuild()之前准备好。
"""


class User(BaseModel):
    id: int
    age: int
    name: str = "John Doe"


original_user = User(id=123, age=32)

user_data = original_user.model_dump()
print(user_data)
# > {'id': 123, 'age': 32, 'name': 'John Doe'}
fields_set = original_user.model_fields_set
print(fields_set)
# > {'age', 'id'}

# ...
# pass user_data and fields_set to RPC or save to the database etc.
# ...

# you can then create a new instance of User without
# re-running validation which would be unnecessary at this point:
new_user = User.model_construct(_fields_set=fields_set, **user_data)
print(repr(new_user))
# > User(id=123, age=32, name='John Doe')
print(new_user.model_fields_set)
# > {'age', 'id'}

# construct can be dangerous, only use it with validated data!:
bad_user = User.model_construct(id="dog")
print(repr(bad_user))
# > User(id='dog', name='John Doe')
"""
Demo结果解析：
Pydantic 提供了 model_construct() 方法允许在没有验证的情况下创建模型。_fields_set 关键字参数model_construct()是可选的，但可以让您更准确地了解
哪些字段最初已设置，哪些字段未设置。如果省略，model_fields_set 则只是所提供数据的键。在上面的示例中，如果_fields_set未提供，
new_user.model_fields_set 则将为{'id', 'age', 'name'}。除此之外，model_construct() 还有一些其他的说明：
1、当我们说“不执行验证”时，这包括将字典转换为模型实例。因此，如果您有一个具有类型的字段Model，则需要先将内部字典转换为模型，然后再将其传递给 model_construct().
   特别是，该 model_construct() 方法不支持从字典递归构建模型。
2、如果您不为具有默认值的字段传递关键字参数，则仍将使用默认值。
   对于带有 的模型 model_config['extra'] == 'allow'，与字段不对应的数据将被正确存储在 __pydantic_extra__字典中。
3、对于具有私有属性的模型，__pydantic_private__字典将被初始化，就像调用__init__.
   使用 构造实例时 model_construct()，__init__ 即使定义了自定义方法，也不会调用模型或其任何父类中的任何方法__init__。
"""

"""
2、通用模型
Pydantic支持创建通用模型，以便更轻松地重用通用模型结构。
为了声明通用模型，您需要执行以下步骤：
声明一个或多个 typing.TypeVar 实例以用于参数化您的模型。
声明一个继承自 pydantic.BaseModel 和 的 pydantic 模型 typing.Generic，您可以将 TypeVar 实例作为参数传递给typing.Generic。
使用 TypeVar 实例作为注释，您希望将它们替换为其他类型或 pydantic 模型。
"""


DataT = TypeVar("DataT")


class DataModel(BaseModel):
    numbers: List[int]
    people: List[str]


class Response(BaseModel, Generic[DataT]):
    data: Optional[DataT] = None


data = DataModel(numbers=[1, 2, 3], people=[])

print(Response[int](data=1))
# > data=1
print(Response[str](data="value"))
# > data='value'
print(Response[str](data="value").model_dump())
# > {'data': 'value'}
print(Response[DataModel](data=data).model_dump())
# > {'data': {'numbers': [1, 2, 3], 'people': []}}
try:
    Response[int](data="value")
except ValidationError as e:
    print(e)
    """
    1 validation error for Response[int]
    data
      Input should be a valid integer, unable to parse string as an integer [type=int_parsing, input_value='value', input_type=str]
    """
"""
Demo结果解析：
TypeVar定义一种泛型，使用Generic[]定义一种泛型类，Response通过继承Generic具备了泛化的能力，除此之外，这种泛型类还具有类型校验的能力。
"""

"""
3、动态模型
在某些情况下，需要使用运行时信息来创建模型来指定字段。Pydantic提供了create_model允许动态创建模型的能力。
"""


DynamicFoobarModel = create_model("DynamicFoobarModel", foo=(str, ...), bar=(int, 123))


class StaticFoobarModel(BaseModel):
    foo: str
    bar: int = 123


"""
Demo结果解析：
这个的StaticFoobarModel和DynamicFoobarModel表示的模型是等价的
"""

"""
4、自定义根类型RootModel
根类型可以是 Pydantic 支持的任何类型，同时也是由泛型参数指定RootModel。RootModel其实就是官方提供的一个继承BaseModel和泛型类Generic[T]的子类。
根值可以传递给模型__init__或model_validate 通过第一个也是唯一的参数传递。
"""


Pets = RootModel[List[str]]
PetsByName = RootModel[Dict[str, str]]


print(Pets(["dog", "cat"]))
# > root=['dog', 'cat']
print(Pets(["dog", "cat"]).model_dump_json())
# > ["dog","cat"]
print(Pets.model_validate(["dog", "cat"]))
# > root=['dog', 'cat']
print(Pets.model_json_schema())
"""
{'items': {'type': 'string'}, 'title': 'RootModel[List[str]]', 'type': 'array'}
"""

print(PetsByName({"Otis": "dog", "Milo": "cat"}))
# > root={'Otis': 'dog', 'Milo': 'cat'}
print(PetsByName({"Otis": "dog", "Milo": "cat"}).model_dump_json())
# > {"Otis":"dog","Milo":"cat"}
print(PetsByName.model_validate({"Otis": "dog", "Milo": "cat"}))
# > root={'Otis': 'dog', 'Milo': 'cat'}
"""
Demo结果解析：
使用RootModel的自定义根类型进行初始化，value值会被赋值给 RootModel 中的 root 字段。因为 RootModel 还继承了BaseModel，所以它还具有校验、序列化和查看模型schema结构的能力
"""
