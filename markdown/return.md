# 结果返回
<p>用户可以提供返回信息，当硬件操作结束后，所有的返回值会发送给指定的目的地。</p>
<p>在事件中加入<b>return</b>键来指定某个特定返回地址</p>
<p>目前支持如下三种返回类型：</p>

## tcp
<p>指定一个IP地址，当硬件操作结束后，结果会通过TCP发送到该IP地址</p>

```
{
  ...
  "return": ["tcp", "IP地址:端口号"]
}

比如，下面的例子是一个now事件，当引脚0的电压翻转后，结果不但会返回给发送方，还会通过tcp的方式发送给IP地址192.168.1.110，端口5050：
{
  "event":"now",
  "actions": [["gpio", 0, "output", 2]]
  "return": ["tcp", "192.168.1.110:5050"]
}

```


## udp
<p>指定一个IP地址，当硬件操作结束后，结果会通过UDP发送到该IP地址</p>

```
{
  ...
  "return": ["udp", "IP地址:端口号"]
}

比如，下面的例子是一个schedule事件，每5秒会进行一个ADC采样，每次采样结束后，结果会通过udp的方式发送给IP地址192.168.1.110，端口8001：
{
  "event":"schedule",
  "interval": "5s",
  "actions": [["adc", 0, "5v"]]
  "return": ["udp", "192.168.1.110:8001"]
}
```

## 文件
<p>指定一个文件名，当硬件操作结束后，结果会保存到该文件中。</p>

<blockquote>
该文件会默认保存到user文件夹中。
</blockquote>

```
{
  ...
  "return": ["file", "文件名"]
}

比如，下面的例子是一个schedule事件，每5秒会进行一个ADC采样，每次采样结束后，结果会保存到adc_sample.txt文件中。
用户可读取SD卡，访问/user/adc_sample.txt来获得采样结果：

{
  "event":"schedule",
  "interval": "5s",
  "actions": [["adc", 0, "5v"]]
  "return": ["file", "adc_sample.txt"]
}
```
