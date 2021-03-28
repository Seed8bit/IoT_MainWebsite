#### 返回定义
* 任何一个事件都可以指定某个特定的返回，目前支持如下两种返回类型
  * tcp
  * udp
  * file (待实现)
* 定义：在event JSON中加入`return`条目来指定某个特定返回地址
  * tcp
```
{
  ...
  "return": ["tcp", "IP_ADDRESS:PORT_NUMBER"]
}
```

  * udp
```
{
  ...
  "return": ["udp", "IP_ADDRESS:PORT_NUMBER"]
}
```

* 说明
  * 当定义`return`在`now`事件中时，系统除了给发送方返回信息外，还会给`return`中指定的地址返回信息。
  * 当定义`return`在`schedule`或`pinstate`事件中时，系统每次执行事件后都会将结果返回给`return`中指定的地址。
* 例子：
```
{   
  "event":"pinstate",  
  "pin":"PK4",  
  "trigger":"falling",  
  "actions": [["gpio","PH5","output",2]], 
  "return":["udp","192.168.1.104:2222"]
}

说明：以上例子当PK4的产生下降沿电压变化时，PH5的电压会进行反转，然后将结果通过UDP发给IP地址192.168.1.104，端口2222。
```
