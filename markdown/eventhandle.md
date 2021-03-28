#### 事件处理机制
系统定义如下事件，每个事件对JSON发送包有不同的要求：
* `now` 事件：

该事件会即刻发送，发送包里的`actions`会即可进行执行。格式如下：
```
{
  "event":"now",
  "actions": [["ACTION_1"], ["ACTION_2"], ...]
}

//比如以下请求将PH5的电压进行反转：
{
  "event":"now",
  "actions": [["gpio","PH5","output",2]]
}

//比如如下请求将PH5, PH6, PH7的同时进行反转：
{
  "event":"now",
  "actions": [["gpio","PH5","output",2],["gpio","PH6","output",2],["gpio","PH7","output",2]]
}
```

* `schedule`事件

该事件会定义事件发生事件（可选），结束事件（可选）和间隔事件（必填，最小值1秒）。每当时间和间隔满足要求，时间即发生。格式如下：
```
{
  "event":"schedule",
  "interval":"REPEAT_INTERVAL"(必填)
  "start":"START_TIME_DATE" (可选)
  "end":"END_TIME_DATE" (可选)
  "actions": [["ACTION_1"], ["ACTION_2"], ...]
}

说明：
1. "interval" 必须有时间单位量，目前支持：'s'(秒), 'm'(分钟), 'h'(小时) 和 'd'(天)
2. "start"和"end"必须满足日期时间格式: "YYYY/MM/DD HH:MM:SS" (比如: "2020/11/28 15:30:45")

比如如下请求将PH5的电压进行反转，而且每5秒钟反转一次，从2020/1/1 的下午两点进行到下午四点。
{
  "event":"schedule",
  "interval":"5s",
  "start":"2020/1/1 14:00:00",
  "end":"2020/1/1 16:00:00",
  "actions": [["gpio","PH5","output",2]]
}
```
