# 中断处理
* `pinstate`事件

该事件定义当某个pin的电压发生某些改变时，会发生的事件。改变包括上升沿，下降沿或任何电压改变。格式如下：
```
{
  "event": "pinstate",
  "pin": "PIN_NAME", (必填)
  "trigger": "TRIGGER_NAME", (必填)
  "actions": [["ACTION_1"], ["ACTION_2"], ...]
}

说明：
1. pin目前支持如下4个pin: PK4 / PK5 / PK6 / PK7
2. trigger支持：change/rising/falling

比如如下请求在PK4上升沿时，反转PH5的电压:
{
  "event": "pinstate",
  "pin": "PK4",
  "trigger": "rising",
  "actions": [["gpio","PH5","output",2]]
}
```