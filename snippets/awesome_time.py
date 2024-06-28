import calendar
import inspect
import re
import time
from datetime import date, datetime, timedelta

import pytz

################################################################
# date类
#     date类定义了一些常用的类方法与类属性:
#         max、min：date对象所能表示的最大、最小日期
#         resolution：date对象表示日期的最小单位。这里是天
#         today()：返回一个表示当前本地日期的date对象
#         fromtimestamp(timestamp)：根据给定的时间戮，返回一个date对象
#         fromordinal(ordinal)：将Gregorian日历时间转换为date对象(特殊历法用不上)

#     date提供的实例方法和属性：
#         .year：返回年
#         .month：返回月
#         .day：返回日
#         .replace(year, month, day)：生成一个新的日期对象，用参数指定的年，月，日代替原有对象中的属性。（原有对象仍保持不变）
#         .weekday()：返回weekday，如果是星期一，返回0；如果是星期2，返回1，以此类推
#         .isoweekday()：返回weekday，如果是星期一，返回1；如果是星期2，返回2，以此类推
#         .isocalendar()：返回格式如(year, wk num, wk day)
#         .isoformat()：返回格式如’YYYY-MM-DD’的字符串
#         .strftime(fmt)：自定义格式化字符串。与time模块中的strftime类似。
#         .toordinal()：返回日期对应的Gregorian Calendar日期
################################################################


################################################################
# time类
#     time类的构造函数如下：（其中参数tzinfo，它表示时区信息。）
#         class datetime.time(hour[, minute[, second[, microsecond[, tzinfo]]]])
#     time类定义的类属性：
#         min、max：time类所能表示的最小、最大时间。其中，time.min = time(0, 0, 0, 0)， time.max = time(23, 59, 59, 999999)
#         resolution：时间的最小单位，这里是1微秒
#     time类提供的实例方法和属性：
#         .hour、.minute、.second、.microsecond：时、分、秒、微秒
#         .tzinfo：时区信息
#         .replace([hour[, minute[, second[, microsecond[, tzinfo]]]]])：创建一个新的时间对象，用参数指定的时、分、秒、微秒代替原有对象中的属性（原有对象仍保持不变）；
#         .isoformat()：返回型如”HH:MM:SS”格式的字符串表示；
#         .strftime(fmt)：返回自定义格式化字符串。
################################################################


################################################################
# datetime类
#     datetime是date与time的结合体，包括date与time的所有信息。它的构造函数如下：datetime.datetime(year, month, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]])，各参数的含义与date、time的构造函数中的一样，要注意参数值的范围。

#     datetime类定义的类属性与方法：
#         min、max：datetime所能表示的最小值与最大值；
#         resolution：datetime最小单位；
#         today()：返回一个表示当前本地时间的datetime对象；
#         now([tz])：返回一个表示当前本地时间的datetime对象，如果提供了参数tz，则获取tz参数所指时区的本地时间；
#         utcnow()：返回一个当前utc时间的datetime对象；
#         fromtimestamp(timestamp[, tz])：根据时间戮创建一个datetime对象，参数tz指定时区信息；
#         utcfromtimestamp(timestamp)：根据时间戮创建一个datetime对象；
#         combine(date, time)：根据date和time，创建一个datetime对象；
#         strptime(date_string, format)：将格式字符串转换为datetime对象；
#         date()：获取date对象；
#         time()：获取time对象；
#         replace([year[, month[, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]]]]])：
#         timetuple()
#         utctimetuple()
#         toordinal()
#         weekday()
#         isocalendar()
#         isoformat([sep])
#         ctime()：返回一个日期时间的C格式字符串，等效于ctime(time.mktime(dt.timetuple()))；
#         strftime(format): 返回自定义格式化字符串
################################################################


################################################################
# timedelta类
#     通过timedelta函数返回一个timedelta对象，也就是一个表示时间间隔的对象。函数参数情况如下所示:
#         class datetime.timedelta([days[, seconds[, microseconds[, milliseconds[, minutes[, hours[, weeks]]]]]]])
#     其没有必填参数，简单控制的话第一个整数就是多少天的间隔的意思:
#     datetime.timedelta(10)
#     两个时间间隔对象可以彼此之间相加或相减，返回的仍是一个时间间隔对象。
#     而更方便的是一个datetime对象如果减去一个时间间隔对象，那么返回的对应减去之后的datetime对象，
#     然后两个datetime对象如果相减返回的是一个时间间隔对象。这很是方便。
################################################################


################################################################
# pytz模块
#     pytz是Python的一个时区处理模块
################################################################


################################################################
# datetime 操作相关
################################################################


# NOTE: 获取当前日期和时间
def get_datetime_now() -> datetime:
    return datetime.now()


def get_datetime_today() -> datetime:
    return datetime.today()


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 当前日期和时间：",
    get_datetime_now(),
)
print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 当前日期和时间：",
    get_datetime_today(),
)


# NOTE: 获取当前时间戳
def get_now_timestamp(is_str: bool = True):
    return str(round(time.time()) * 1000) if is_str else round(time.time()) * 1000


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取当前时间戳：",
    get_now_timestamp(),
)


# NOTE: 获取当前时间字符串
def get_now_str(pattern: str):
    return datetime.now().strftime(pattern)


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 取当前时间字符串：",
    get_now_str("%Y-%m-%d %H:%M:%S"),
)


# NOTE: 生成一个指定日期时间的datetime对象
# NOTE: 生成指定日期时间的datetime对象时7个参数，分别为年、月、日、小时、分、秒、微秒,年、月、日必须填写，其他如果没填视为0
# NOTE: 生成时要注意各时间单位有效性，否则要抛出异常
def generates_specified_datetime(
    year: int,
    month: int,
    day: int,
    hour: int,
    minute: int,
    second: int,
    microsecond: int,
) -> datetime:
    return datetime(year, month, day, hour, minute, second, microsecond)


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 生成一个指定日期时间的datetime对象：",
    generates_specified_datetime(2024, 2, 2, 12, 12, 12, 99),
)


# NOTE: 获取datetime对象 年
def get_datetime_year(datetime: datetime) -> int:
    return datetime.year


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取datetime对象年份：",
    get_datetime_year(datetime.now()),
)


# NOTE: 获取datetime对象 月
def get_datetime_month(datetime: datetime) -> int:
    return datetime.month


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取datetime对象月份：",
    get_datetime_month(datetime.now()),
)


# NOTE: 获取datetime对象 日
def get_datetime_day(datetime: datetime) -> int:
    return datetime.day


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取datetime对象日份：",
    get_datetime_day(datetime.now()),
)


# NOTE: 获取datetime对象 小时
def get_datetime_hour(datetime: datetime) -> int:
    return datetime.hour


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取datetime对象小时数值：",
    get_datetime_hour(datetime.now()),
)


# NOTE: 获取datetime对象 分钟
def get_datetime_minute(datetime: datetime) -> int:
    return datetime.minute


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取datetime对象分钟数值：",
    get_datetime_minute(datetime.now()),
)


# NOTE: 获取datetime对象 秒
def get_datetime_second(datetime: datetime) -> int:
    return datetime.second


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取datetime对象秒数值：",
    get_datetime_second(datetime.now()),
)


# NOTE: 获取datetime对象 微妙
def get_datetime_microsecond(datetime: datetime) -> int:
    return datetime.microsecond


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取datetime对象微秒数值：",
    get_datetime_microsecond(datetime.now()),
)


# NOTE: 修改datetime对象的各时间单位的数值replace()
def datetime_replace(
    datetime: datetime,
    year: int = None,
    month: int = None,
    day: int = None,
    hour: int = None,
    minute: int = None,
    second: int = None,
    microsecond: int = None,
) -> datetime:
    return datetime.replace(
        year=year,
        month=month,
        day=day,
        hour=hour,
        minute=minute,
        second=second,
        microsecond=microsecond,
    )


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 修改datetime对象的各时间单位的数值：",
    datetime_replace(datetime.now(), 2024, 2, 2, 12, 12, 12, 0),
)


# NOTE: 获取指定时间是一周中的第几个工作日,返回值为0-6，周一Monday返回0周天Sunday返回6
def get_datetime_weekday(datetime: datetime) -> int:
    return datetime.weekday()


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 获取指定时间是一周中的第几个工作日：",
    get_datetime_weekday(datetime.now()),
)


# NOTE: 获取指定时间是一周中的第几个工作日,返回值为1-7，返回值为1-7，周一Monday返回1周天Sunday返回7
def get_datetime_isoweekday(datetime: datetime) -> int:
    return datetime.isoweekday()


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 获取指定时间是一周中的第几个工作日：",
    get_datetime_isoweekday(datetime.now()),
)


# NOTE: 通过timedelta类，可以进行时间的加减操作


def get_datetime_offset(
    datetime: datetime,
    days: int = 0,
    minutes: int = 0,
    seconds: int = 0,
    microseconds: int = 0,
    milliseconds: int = 0,
    weeks: int = 0,
) -> datetime:
    return datetime - timedelta(
        days=days,
        minutes=minutes,
        seconds=seconds,
        microseconds=microseconds,
        milliseconds=milliseconds,
        weeks=weeks,
    )


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 进行时间的加减操作：",
    get_datetime_offset(datetime=datetime.now(), days=2),
)


################################################################
# 时间和字符串相关
################################################################

# NOTE: 时间格式化操作符说明
"""
操作符	 作用
%a	    星期几的简写
%b	    月分的简写
%c	    标准的日期的时间串
%d	    十进制表示的每月的第几天
%e	    在两字符域中，十进制表示的每月的第几天
%g	    年份的后两位数字，使用基于周的年
%h	    简写的月份名
%I	    12小时制的小时
%m	    十进制表示的月份
%n	    新行符
%r	    12小时的时间
%S	    十进制的秒数
%T	    显示时分秒：hh:mm:ss
%U	    第年的第几周，把星期日做为第一天（值从0到53）
%w	    十进制表示的星期几（值从0到6，星期天为0）
%x	    标准的日期串
%y	    不带世纪的十进制年份（值从0到99）
%z	    ，%Z 时区名称，如果不能得到时区名称则返回空字符。
%A	    星期几的全称
%B	    月份的全称
%C	    年份的后两位数字
%D	    月/天/年
%F	    年-月-日
%G	    年分，使用基于周的年
%H	    24小时制的小时
%j	    十进制表示的每年的第几天
%M	    十时制表示的分钟数
%p	    本地的AM或PM的等价显示
%R	    显示小时和分钟：hh:mm
%t	    水平制表符
%u	    每周的第几天，星期一为第一天 （值从0到6，星期一为0）
%V	    每年的第几周，使用基于周的年
%W	    每年的第几周，把星期一做为第一天（值从0到53）
%X	    标准的时间串
%Y	    带世纪部分的十制年份
%%	    百分号
"""


# NOTE: datetime对象转换为字符串
def datetime_to_str(datetime: datetime) -> str:
    return str(datetime)


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": datetime对象转换为字符串：",
    datetime_to_str(datetime.now()),
)


# NOTE: datetime对象转换为ISO标准的日期时间字符串
def datetime_to_iso_str(datetime: datetime) -> str:
    return datetime.isoformat()


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": datetime对象转换为ISO标准的日期时间字符串：",
    datetime_to_iso_str(datetime.now()),
)


# NOTE: datetime对象转换为指定格式日期时间字符串
def datetime_to_format_str(datetime: datetime, pattern: str) -> str:
    return datetime.strftime(pattern)


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": datetime对象转换为指定格式日期时间字符串：",
    datetime_to_format_str(datetime.now(), "%Y-%m-%d %H:%M:%S"),
)


# NOTE: 时间字符串转换datetime对象
def str_to_datetime(str_datetime: str, pattern: str) -> datetime:
    return datetime.strptime(str_datetime, pattern)


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 时间字符串转换datetime对象：",
    str_to_datetime(
        datetime_to_format_str(datetime.now(), "%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S"
    ),
)


# NOTE: ISO时间字符串生转换datetime对象
def iso_str_to_datetime(iso_str_datetime: str) -> datetime:
    return datetime.fromisoformat(iso_str_datetime)


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": ISO时间字符串生转换datetime对象：",
    iso_str_to_datetime(datetime_to_iso_str(datetime.now())),
)


# NOTE: 时间字符串生转换时间戳
def ts_str_to_timestamp(ts_str: str):
    if not ts_str or isinstance(ts_str, str) is False:
        return None
    if re.compile("^[0-9]+$").match(ts_str) is not None:
        return ts_str
    _datetime = datetime.strptime(ts_str, "%Y-%m-%d %H:%M:%S")
    return int(_datetime.timestamp() * 1000)


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 时间字符串生转换时间戳：",
    ts_str_to_timestamp("2024-02-02 10:10:10"),
)


################################################################
# 时间和时间戳相关
################################################################


# NOTE: 将 datetime 转换为 13 位时间戳
def datetime_to_timestamp(datetime: datetime) -> int:
    return int(datetime.timestamp() * 1000)


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 将 datetime 转换为 13 位时间戳：",
    datetime_to_timestamp(datetime.now()),
)


# NOTE: 将 13 位时间戳 转换为 datetime
def timestamp_to_datetime(timestamp: int) -> datetime:
    return datetime.fromtimestamp(timestamp / 1000)


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 将 13 位时间戳 转换为 datetime：",
    timestamp_to_datetime(1706853255379),
)


# NOTE: 获取当前秒级时间戳
def get_second_timestamp() -> int:
    return int(time.time())


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取当前秒时间戳：",
    get_second_timestamp(),
)


# NOTE: 获取当前微秒级时间戳
def get_microsecond_timestamp() -> int:
    return datetime.now().timestamp()


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取当前微秒级时间戳：",
    get_microsecond_timestamp(),
)


################################################################
# 日历相关
################################################################


# NOTE: 获取指定年月的日历
def get_calendar_month(year: int, month: int):
    return calendar.month(year, month)


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取指定年月的日历：",
    get_calendar_month(2024, 2),
)


# NOTE: 获取指定年份的日历
def get_calendar(year: int):
    return calendar.prcal(year)


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取指定年份的日历：",
    get_calendar(2024),
)


################################################################
# 项目中使用
################################################################


# NOTE: 根据时间数组字符串参数,获取起止时间戳
def build_datetime_range(dt: list[str, str]) -> tuple[str, str]:
    if type(dt[0]) is date or type(dt[0]) is datetime:
        [start_date, end_date] = dt
        start_datetime = datetime.combine(start_date, datetime.min.time())
        end_datetime = datetime.combine(end_date, datetime.max.time())
        start_ts = str(int(start_datetime.timestamp() * 1000))
        end_ts = str(int(end_datetime.timestamp() * 1000))
        return start_ts, end_ts
    elif type(dt[0]) is str and len(dt[0]) > 10:
        [start_date, end_date] = dt
        start_ts = str(
            int(datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S").timestamp() * 1000)
        )
        end_ts = str(
            int(datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S").timestamp() * 1000)
        )
        return start_ts, end_ts
    else:
        [start_date, end_date] = dt if len(dt) == 2 else [dt[0], dt[0]]
        start_date += " 00:00:00"
        end_date += " 23:59:59"
        start_ts = str(
            int(datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S").timestamp() * 1000)
        )
        end_ts = str(
            int(datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S").timestamp() * 1000)
        )
        return start_ts, end_ts


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 根据时间数组字符串参数,获取起止时间：",
    build_datetime_range(["2024-02-02 10:10:10", "2024-03-03 10:10:10"]),
)


# NOTE: 根据date数组字符串参数,构建时间戳范围查询条件
def datetime_to_timestamp_gte_lte(
    key: str, dt: list[str, str], is_int: bool = False
) -> dict:
    [start_date, end_date] = dt
    start_date += " 00:00:00"
    end_date += " 23:59:59"
    start_ts__int = int(
        datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S").timestamp() * 1000
    )
    start_ts = start_ts__int if is_int else str(start_ts__int)
    end_ts__int = int(
        datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S").timestamp() * 1000
    )
    end_ts = end_ts__int if is_int else str(end_ts__int)
    obj = {key: {"$gte": start_ts, "$lte": end_ts}}
    return obj


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 根据date数组字符串参数,构建时间戳范围查询条件：",
    datetime_to_timestamp_gte_lte("created_at", ["2024-02-02", "2024-03-03"], False),
)


# NOTE: 根据datetime数组字符串参数,构建时间范围查询条件
def datetime_gte_lte(key: str, dt: list[str, str], pattern: str) -> dict:
    start_datetime = datetime.strptime(dt[0], pattern)
    end_datetime = datetime.strptime(dt[1], pattern)
    obj = {key: {"$gte": start_datetime, "$lte": end_datetime}}
    return obj


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 根据datetime数组字符串参数,构建时间戳范围查询条件：",
    datetime_gte_lte(
        "created_at",
        ["2024-02-02 10:10:10", "2024-03-03 10:10:10"],
        "%Y-%m-%d %H:%M:%S",
    ),
)


# NOTE: 根据date数组字符串参数,构建时间范围查询条件
def date_gte_lte(key: str, dt: list[str, str], pattern: str) -> dict:
    start_date = datetime.strptime(dt[0], pattern)
    end_date = datetime.strptime(dt[1], pattern)
    obj = {key: {"$gte": start_date, "$lte": end_date}}
    return obj


print(
    ">>>line"
    + str(inspect.currentframe().f_lineno)
    + ": 根据date数组字符串参数,构建时间范围查询条件：",
    date_gte_lte("created_at", ["2024-02-02", "2024-03-03"], "%Y-%m-%d"),
)


################################################################
# 时区
################################################################


# NOTE: 获取utc时间
def get_utc_datetime() -> datetime:
    return datetime.now()


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取utc时间：",
    get_utc_datetime(),
)


# NOTE: 本地指定时间转换成UTC时间
def local_datetime_to_utc_datetime(datetime: datetime) -> datetime:
    return datetime - timedelta(hours=8)


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 本地指定时间转换成UTC时间：",
    local_datetime_to_utc_datetime(datetime.now()),
)


# NOTE: 指定UTC时间转换成本地时间
def utc_datetime_to_local_datetime(datetime: datetime) -> datetime:
    return datetime - timedelta(hours=-8)


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 指定UTC时间转换成本地时间：",
    utc_datetime_to_local_datetime(get_utc_datetime()),
)


# NOTE: 获取指定时区时间
def get_timezone_datetime(time_zone_name: str) -> datetime:
    return datetime.now().astimezone(pytz.timezone(time_zone_name))


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 获取指定时区时间：",
    get_timezone_datetime("America/New_York"),
)


# NOTE: 指定时间进行时区转换
def datetime_astimezone(
    source_datetime: datetime, source_time_zone_name: str, target_time_zone_name: str
) -> datetime:
    source_datetime = pytz.timezone(source_time_zone_name).localize(source_datetime)
    return source_datetime.astimezone(pytz.timezone(target_time_zone_name))


print(
    ">>>line" + str(inspect.currentframe().f_lineno) + ": 指定时间进行时区转换：",
    datetime_astimezone(
        datetime.now() - timedelta(days=-8, hours=-2),
        "America/New_York",
        "Asia/Shanghai",
    ),
)
