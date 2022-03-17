# 系统交互
用户有三种方式可以与系统进行交互:
<ol>
  <li>通过串口对系统进行配置或读取系统信息。</li>
  <li>连接以太网，通过以太网发送请求进行硬件操作，或访问预存在SD卡中的网站。</li>
  <li>通过SD卡和系统交互，当系统启动时，会读取预存在SD卡中的硬件操作文件。</li>
</ol>

## 通过串口对系统进行配置
硬件平台的配置需要通过串口连接，用户需要5V的USB-TTL串口连接线。
<blockquote>
USB-TTL串口连接线有多种电压选择，对于该硬件平台，用户请选择5V的电压，其他电压可能会无法和硬件平台通信。
</blockquote>

用户需要将串口线的USB一端连接到PC，另串口端连接到硬件平台，示意图如下：
<blockquote>
串口的TX端和平台的RX连接，串口的RX端和平台的TX连接。
</blockquote>
<br>
<img style="max-width: 800px; height: auto; " src="img/RectCreamSerialConnection.png"/>

当串口连接好后，用户即可通过串口和硬件平台交互，串口的波特率设置为9600，八个数据位，无奇偶校验，一个停止位。

<blockquote>
<p>Linux用户: 可使用<a href="https://www.runoob.com/linux/linux-comm-screen.html">screen命令</a>，<a href="https://www.jianshu.com/p/54005e3095f3">socat命令</a>等。</p>
<p>
比如，<b>echo "VERSION" | socat - /dev/ttyUSB0,crnl</b> 即使用socat命令从usb设备/dev/ttyUSB0读取硬件平台版本信息。
</p>
<p>Windows用户: 需下载串口调试软件，如<a href="https://dl.pconline.com.cn/download/2335414.html">串口调试助手</a>。</p>
</blockquote>

用户需要发送对应的串口指令，每个串口指令最后需要有回车符(\r)结束命令。

#### 获得当前版本信息:
<p>命令：<b>VERSION</b></p>
<p>返回：字符串表示版本信息</p>
<p>示例：
<blockquote>
<p>$ echo "VERSION" | socat - /dev/ttyUSB0</p>
<p>Ver: 1.0</p>
</blockquote>
</p>

#### 配置输出电压
<p>读取电压命令：<b>VOLTAGE GET</b></p>
<p>返回：当前系统设置的输出电压</p>
<p>示例：
<blockquote>
<p>$ echo "VOLTAGE GET" | socat - /dev/ttyUSB0</p>
<p>5</p>
</blockquote>
</p>

<p>写入电压命令：<b>VOLTAGE SET {电压值}</b></p>
<p>参数：{电压值}，可选择5/9/15/20之一</p>
<p>返回：无返回值</p>
<p>示例：
<blockquote>
<p>$ echo "VOLTAGE SET 15" | socat - /dev/ttyUSB0</p>
</blockquote>
</p>

<blockquote>
说明：为了让硬件平台能够提供不同的输出电压，用户需要确保硬件平台的电源支持USB Type Power Delivery (即100W功率)
</blockquote>

#### 时间设置
<p>读取系统时间命令：<b>TIME GET</b></p>
<p>如果系统已经设置时间，返回：当前系统的时间，格式：年/月/日 时:分:秒。如果系统未设置时间，返回：NOT SET</p>
<p>示例：
<blockquote>
<p>$ echo "TIME GET" | socat - /dev/ttyUSB0</p>
<p>21/05/01 13:15:20</p>
</blockquote>
</p>

<p>写入系统时间命令：<b>TIME SET {年} {月} {日} {时} {分} {秒}</b></p>
<p>参数：{年}，基准值为2000年，即如果想设置为2015年，该参数为15</p>
<p>参数：{月}，1-12之一</p>
<p>参数：{日}，1-31，请注意如果时间无效，将不会被设置</p>
<p>参数：{时}，0-23之一</p>
<p>参数：{分}，0-59之一</p>
<p>参数：{秒}，0-59之一</p>
<p>返回：无返回值</p>
<p>示例：
<blockquote>
<p>$ echo "TIME SET 21 5 1 13 15 0" | socat - /dev/ttyUSB0</p>
<p>将系统时间设置为2021年5月1号，13点15分0秒
</blockquote>
</p>

<blockquote>
说明：如果用户希望在系统断电后时间模块依然可以正常记录时间，请将CR1225纽扣电池插入硬件平台的电池槽。
</blockquote>

#### MDNS设置
用户可以设置不同的MDNS名称，设置完成后。用户不需要通过IP地址访问硬件平台，可直接根据MDNS名称访问平台，比如用户设置MDNS名称为"platform"，则可通过"www.platform.local"即可访问硬件平台。
<p>读取MDNS命令：<b>MDNS GET</b></p>
<p>如果系统已经MDNS名称，返回：当前MDNS名称。如果系统未设置，返回：NOT SET</p>
<p>示例：
<blockquote>
<p>$ echo "MDNS GET" | socat - /dev/ttyUSB0</p>
<p>rectcream</p>
</blockquote>
</p>

<p>写入MDNS命令：<b>MDNS SET {名称}</b></p>
<p>参数：{名称}，不超过64个字符</p>
<p>返回：无返回值</p>
<p>示例：
<blockquote>
<p>$ echo "MDNS SET rectcream" | socat - /dev/ttyUSB0</p>
<p>设置MDNS名称为"rectcream"</p>
</blockquote>
</p>

#### 网络参数设置
用户可以自定义硬件平台的网络参数，即IP地址，子网掩码和网管地址。如果用户未设置网络参数，或网络参数无效，硬件平台默认使用DHCP，即从当前网络中自动获取网络参数。

<p>读取当前IP地址：<b>IP GET</b></p>
<p>返回：第一行为系统设置的IP地址，第二行为当前系统的IP地址</p>
<p>示例：
<blockquote>
<p>实例中，系统设置的IP地址为192.168.1.254，当前系统的IP地址为192.168.1.10</p>
<p>$ echo "IP GET" | socat - /dev/ttyUSB0</p>
<p>192 168 1 254</p>
<p>192 168 1 10</p>
</blockquote>
</p>

<p>写入当前IP地址：<b>IP SET</b></p>
<p>返回：无返回值</p>
<p>示例：
<blockquote>
<p>$ echo "IP SET 192.168.1.254" | socat - /dev/ttyUSB0</p>
</blockquote>
</p>

<p>读取当前子网掩码地址：<b>NETMASK GET</b></p>
<p>返回：第一行为系统设置的子网掩码地址，第二行为当前系统的子网掩码地址</p>
<p>示例：
<blockquote>
<p>实例中，系统设置的子网掩码地址为255.255.255.0，当前系统的子网掩码地址为255.255.255.0</p>
<p>$ echo "NETMASK GET" | socat - /dev/ttyUSB0</p>
<p>255 255 255 0</p>
<p>255 255 255 0</p>
</blockquote>
</p>

<p>写入子网掩码地址：<b>NETMASK SET</b></p>
<p>返回：无返回值</p>
<p>示例：
<blockquote>
<p>$ echo "NETMASK SET 255.255.255.0" | socat - /dev/ttyUSB0</p>
</blockquote>
</p>

<p>读取当前网关地址：<b>GATEWAY GET</b></p>
<p>返回：第一行为系统设置的网关地址，第二行为当前系统的网关地址</p>
<p>示例：
<blockquote>
<p>实例中，系统设置的网关地址为192.168.1.101，当前系统的网关地址为192.168.1.1</p>
<p>$ echo "GATEWAY GET" | socat - /dev/ttyUSB0</p>
<p>192 168 1 101</p>
<p>192 168 1 1</p>
</blockquote>
</p>

<p>写入网关地址：<b>GATEWAY SET</b></p>
<p>返回：无返回值</p>
<p>示例：
<blockquote>
<p>$ echo "GATEWAY SET 192.168.1.101" | socat - /dev/ttyUSB0</p>
</blockquote>
</p>

#### 恢复出厂设置
该命令用于将系统恢复为默认出厂设置
<p>命令:<b>FACTORY</b></p>
<p>返回：无返回值</p>

## 以太网与系统交互
### 连接
用户可以根据使用场景将平台接入网络，以下是推荐的两种连接方式：
<ol>
<li>
<p>将硬件平台接入路由器网络，计算机即可通过路由器访问硬件平台。</p>
<br>
<img style="max-width: 550px; height: auto; " src="img/RouterConnection.png"/>
</li>
<li>
<p>将硬件平台直接和计算机连接，即可通过计算机直接访问硬件平台。</p>
<br>
<img style="max-width: 550px; height: auto; " src="img/LaptopConnection.png"/>
</li>
</ol>

<blockquote>
对于计算机和硬件平台直接连接的情况，目前大多数以太网接口可以识别出Tx和Rx，因此不需要使用交叉网线即可实现通信。
</blockquote>

### 通信
<p>当硬件平台接入网络后，用户即可以和平台进行通信。客户端通过HTTP请求可以实现和硬件平台的交互，支持以下两种HTTP请求</p>
<ol>
<li>静态网站：用户可将前端页面存在SD卡上的<b>public</b>文件夹。当通过浏览器访问硬件平台时，平台会自动加载<b>pulibc</b>文件夹中的<b>index.html</b>文件，继而可以向用户展示前端页面。</li>
<li>硬件操作命令：用户还可发送HTTP的POST请求到硬件平台，根据请求内容的不同，硬件平台可以进行相应的硬件操作，比如GPIO的设置，ADC采样等。POST请求需要发送到URI为<b>/hardware/operation</b>。请求的内容必须为JSON格式。下面的例子通过<b>curl命令</b>展示了如果进行硬件操作。</li>
</ol>

<blockquote>
<p>对于Linux用户，可以使用<a href="http://ipcmen.com/curl">curl命令</a>或使用<a href="https://ipcmen.com/ping">ping命令</a>和硬件进行基本的通信。</p>
<p>对于Windows用户，可以使用<a href="https://www.postman.com/">postman</a>和硬件进行基本的通信</p>
</blockquote>

<p>如果平台通过DHCP协议从所在网络中得到IP地址等信息，用户可以通过登录路由器配置页面或通过串口的IP地址命令得到硬件平台的IP地址; 如果用户提前设置了静态IP地址，子网掩码，网关地址信息，用户可直接通过IP地址访问硬件平台(这里请注意需要将静态IP地址设置在同一个网络)。</p>
<blockquote>
<p>当时用静态IP地址，子网掩码和网管地址。用户需要确定硬件平台和路由器或计算机在同一个网络。请考虑以下的两种情况：</p>
<p>当使用静态IP地址且硬件平台和计算机直接通过以太网连接时，用户可以手动的设置计算机的网络信息。比如硬件平台的静态IP地址为192.168.1.1，这时，用户可以将计算机的IP地址设置为192.168.1.2，即可进行通信。</p>
<p>当使用静态IP地址且硬件平台连接在路由器网络中时，用户需要确定路由器网络的IP地址并将硬件平台设置在同一个网络中。</p>
</blockquote>

<p>硬件平台的IP地址设置为192.168.1.107，使用以下的ping命令和硬件平台通信，确保网络链路通畅</p>
```
$ ping 192.168.1.107
PING 192.168.1.107 (192.168.1.107) 56(84) bytes of data.
64 bytes from 192.168.1.107: icmp_seq=1 ttl=128 time=0.415 ms
64 bytes from 192.168.1.107: icmp_seq=2 ttl=128 time=0.490 ms
```

<p>以下的curl命令用来模拟浏览器访问硬件平台，平台会将<b>index.html</b>返回给浏览器</p>

```
curl --location --request GET '192.168.1.107'

返回：
index.html的内容
```

<p>以下的curl命令发送一条GPIO硬件操作语言，硬件平台将pin0设置为输出高电平。</p>

```
curl --location --request POST '192.168.1.107/hardware/operation' \
--header 'Content-Type: application/json' \
--data-raw '{
  "event":"now",
  "actions": [["gpio",0, "output", 1]]
}'

返回：
{"event":"now","result":[[1]]}
```

<blockquote>
后面的文档会对每一种硬件操作命令进行详细的说明。
</blockquote>

# SD卡与系统交互
<p>除了通过串口连接线和以太网，用户还可以通过SD卡和系统进行交互。</p>
<p>之前有提到用户可以将前端页面存在<b>public</b>文件夹中，当用户通过浏览器或HTTP请求访问平台时，平台可将前端页面返回给浏览器。除此之外，用户还可将系统配置文件，硬件操作文件存在SD卡上，这些文件同样可以改变硬件平台的行为。</p>
<blockquote>
这里需要说明的是，SD卡目前只支持FAT32文件系统，且块的大小为固定的512字节。
</blockquote>

<p>下面我们对SD上的文件夹统进行说明：</p>
<ol>
<li>public：该文件夹保存所有的静态网站相关的文件，包括HTML, CSS, JS等，当用户使用浏览器访问该系统时，系统会将静态文件返回给浏览器，浏览器进而可以显示页面。</li>
<li>user：该文件夹保存所有用户的文件，比如用户通过HTTP请求在SD上保存一个文件，该文件会被保存到该文件夹。除此之外，该文件夹还保存系统的初始化硬件命令文件<b>boot.json</b></li>
<li>system：该文件夹保存系统文件，包括系统的配置文件<b>config.json</b>，和系统的日志<b>syslog</b></li>
<li>firmware：该文件夹保存系统的固件，如果我们发布了新的固件版本且用户希望升级固件，用户可自行下载固件，然后将固件命名为<b>firmware.hex</b>并保存在该文件夹中。当下次系统上电后，系统会检测到新的固件文件，并做系统升级。</li>
</ol>

## boot.json文件
<p>boot.json保存在<b>user</b>文件夹中，内容和以太网HTTP的硬件操作命令一样，采用JSON格式。当系统上电后，会自动读取该文件，按照文件的内容做出相应的硬件操作。</p>
<p>例如，将以下内容保存到boot.json文件中，当系统上电后，会每5秒钟读取ADC的采样，然后通过UDP发送给IP地址192.168.1.105的5000端口。</p>

```
{
  "event":"schedule",
  "interval":"5s",
  "actions": [["adc",0, "5v"]],
  "return": ["udp","192.168.1.105:5000"]
}
```

<blockquote>
更多的硬件操作命令，请参考后面的内容。
</blockquote>

## config.json文件
<p>config.json保存在<b>system</b>文件夹中，实现的功能和通过串口实现的功能一样。当系统上电后，首先会加载通过串口配置的系统信息，然后如果该文件存在，会继而加载该文件，该文件的内容会覆盖之前通过串口配置的信息。当该文件处理完成后，最后便生成系统真正的配置信息，并发送给相应的硬件模块进行配置。</p>

<p>以下例子为config.json的内容，可以将硬件平台的IP地址设置为192.168.1.101，子网掩码设置为255.255.255.0，网关地址设置为192.168.1.1，mdns名称设置为rectcream，输出电压设置为15V。</p>

```
{
  "ip": "192.168.1.101",
  "netmask": "255.255.255.0",
  "gateway": "192.168.1.1",
  "mdns": "rectcream",
  "voltage": "15v"
}
```
