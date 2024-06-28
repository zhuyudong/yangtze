"""
Python 内置函数
https://docs.python.org/3/library/functions.html
"""
import functools

################################################################
# 数字相关
################################################################
### 数据类型

### 进制转换

### 数学运算

################################################################
# 数据结构相关
################################################################
# NOTE: enumerate - 枚举
lst = ["a", "b", "c", "d", "e"]
for index, value in enumerate(lst):
    print(">>>line21: ", index, value)

# NOTE: map - 数据批量转换
numbers = [1, 2, 3, 4, 5]
squared_numbers = list(map(lambda x: x**2, numbers))
print(">>>line94: ", squared_numbers)  # [1, 4, 9, 16, 25]


# NOTE: fitler - 数据筛选
numbers = [1, 2, 3, 4, 5]
even = list(filter(lambda x: x % 2 == 0, numbers))
print(">>>line100: ", even)  # [2, 4]

# NOTE: all - 数据全为真，0, "", {}, [] 为假
print(all([True, 1, "string", {"w": "b"}, [1]]))  # True

# NOTE: any - 数据有一个为真
print(any([True, 0, "", {}, []]))  # False

# NOTE: zip - 数据打包
numbers = [1, 2, 3, 4, 5]
letters = ["a", "b", "c", "d", "e"]
zipped = zip(numbers, letters)
print(">>>line40: ", zipped)  # <zip object at 0x7f183fc0fbc0>
print(">>>line41: ", list(zipped))  # [(1, 'a'), (2, 'b'), (3, 'c'), (4, 'd'), (5, 'e')]

# NOTE: reduce - 数据累积
numbers = [1, 2, 3, 4, 5]
product = functools.reduce(lambda x, y: x * y, numbers)
print(">>>line106: ", product)  # 120


################################################################
# 作用域相关
################################################################
# NOTE: locals - 查看局部变量
# NOTE: globals - 查看全局变量
def f():
    a = 10
    print(locals())  # {'a': 10}
    """
    {'__name__': '__main__', '__doc__': '\nPython 内置函数\n', '__package__': None,
      '__loader__': <_frozen_importlib_external.SourceFileLoader object at 0x7f183fc60450>,
      '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>,
      '__file__': '/home/qj00304/Code/pegasus/portal_backend_cloud/tests/awesome_function_buit-in.py',
      '__cached__': None, 'f': <function f at 0x7f183fc00540>}
    """
    print(globals())


f()

################################################################
# 迭代器生成器相关
################################################################
# NOTE: range - 生成迭代器
for i in range(3):
    print(i)

# NOTE: iter - 生成迭代器，next(it) 等效于 it.__next__()
lst = [1, 2, 3]
it = iter(lst)
print(it.__next__())  # 1
print(next(it))  # 2
print(next(it))  # 3
"""
Traceback (most recent call last):
  File "/home/qj00304/Code/pegasus/portal_backend_cloud/tests/awesome_function_buit-in.py", line 39, in <module>
    print(next(it))  # StopIteration
          ^^^^^^^^
StopIteration
"""
# print(next(it))

################################################################
# 字符串类型代码的执行
################################################################
# NOTE: eval - 执行字符串类型代码并返回结果

s = input("输入 a + b： ")
# 8 + 9
print(eval(s))  # 17
# NOTE: exec - 执行字符串类型代码，不返回任何代码
s = "for i in range(3): print(i)"
a = exec(s)
print(a)  # None

# 待理解
exec(
    """
def func():
    print("Hello, world!")
"""
)
# NOTE: compile - 编译字符串类型代码
code = "for i in range(3): print(i)"
com = compile(code, "", "exec")
exec(com)

code = "8 + 9"
com = compile(code, "", "eval")
print(eval(com))  # 17

code = "name = input('输入你的名字： ')"
com = compile(code, "", "single")
exec(com)


################################################################
# 输入输出
################################################################
# NOTE: input - 输入
# NOTE: print - 输出

################################################################
# 内存相关
################################################################
s = "Hello, world!"
# NOTE: id - 查看内存地址
print(id(s))  # 139846443648112
# NOTE: hash - 查看哈希值，注意列表不可哈希
print(hash(s))  # -8715803522891286558

################################################################
# 文件操作相关
################################################################
# NOTE: open - 打开文件
f = open("tests/awesome_colorama.py", mode="r", encoding="utf-8")
content = f.read()
print(content)
f.close()

################################################################
# 模块相关
################################################################
# NOTE: __import__ - 动态导入模块
# re
name = input("输入你想导入的模块： ")
import_module = __import__(name)
print(
    import_module
)  # <module 're' from '/home/qj00304/anaconda3/envs/portal_backend_cloud/lib/python3.11/re/__init__.py'>

################################################################
# 帮助
################################################################
# NOTE: help - 查看帮助
# print(help(print))

################################################################
# 调用相关
################################################################
# NOTE: callable - 判断对象是否可调用
a = 10
print(callable(a))  # False


def f():
    print("Hello, world!")
    print(callable(f))  # True


f()
print(callable(f))  # True

################################################################
# 查看内置属性
################################################################
# NOTE: dir - 查看内置属性
"""
['ArithmeticError', 'AssertionError', 'AttributeError', 'BaseException', 'BaseExceptionGroup',
  'BlockingIOError', 'BrokenPipeError', 'BufferError', 'BytesWarning', 'ChildProcessError',
  'ConnectionAbortedError', 'ConnectionError', 'ConnectionRefusedError', 'ConnectionResetError',
  'DeprecationWarning', 'EOFError', 'Ellipsis', 'EncodingWarning', 'EnvironmentError', 'Exception',
  'ExceptionGroup', 'False', 'FileExistsError', 'FileNotFoundError', 'FloatingPointError', 'FutureWarning',
  'GeneratorExit', 'IOError', 'ImportError', 'ImportWarning', 'IndentationError', 'IndexError',
  'InterruptedError', 'IsADirectoryError', 'KeyError', 'KeyboardInterrupt', 'LookupError', 'MemoryError',
  'ModuleNotFoundError', 'NameError', 'None', 'NotADirectoryError', 'NotImplemented',
  'NotImplementedError', 'OSError', 'OverflowError', 'PendingDeprecationWarning', 'PermissionError',
  'ProcessLookupError', 'RecursionError', 'ReferenceError', 'ResourceWarning', 'RuntimeError',
  'RuntimeWarning', 'StopAsyncIteration', 'StopIteration', 'SyntaxError', 'SyntaxWarning', 'SystemError',
  'SystemExit', 'TabError', 'TimeoutError', 'True', 'TypeError', 'UnboundLocalError',
  'UnicodeDecodeError', 'UnicodeEncodeError', 'UnicodeError', 'UnicodeTranslateError', 'UnicodeWarning',
  'UserWarning', 'ValueError', 'Warning', 'ZeroDivisionError',
  '__build_class__', '__debug__', '__doc__', '__import__', '__loader__', '__name__', '__package__',
  '__spec__', 'abs', 'aiter', 'all', 'anext', 'any', 'ascii', 'bin', 'bool', 'breakpoint', 'bytearray',
  'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex', 'copyright', 'credits', 'delattr',
  'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'exit', 'filter', 'float', 'format', 'frozenset',
  'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance',
  'issubclass', 'iter', 'len', 'license', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next',
  'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'quit', 'range', 'repr', 'reversed',
  'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type',
  'vars', 'zip']
"""
print(dir(__builtins__))
"""
['__add__', '__class__', '__class_getitem__', '__contains__', '__delattr__', '__dir__', '__doc__',
  '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__getstate__',
  '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__',
  '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmul__', '__setattr__',
  '__sizeof__', '__str__', '__subclasshook__', 'count', 'index']
"""
print(dir(tuple))
