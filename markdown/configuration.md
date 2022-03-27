# 系统配置
物联网平台的网络参数，输出电压，时间参数可由用户进行配置。用户有两种方式可以对系统进行配置:
<ol>
  <li>通过串口对系统进行配置</li>
  <li>通过将配置文件存在SD卡上对系统配置</li>
</ol>

<blockquote>
<p>SD卡上配置文件的优先级高于串口。当串口和SD卡配置了开发板的同一个信息时，SD卡的配置会覆盖串口的配置。</p>
</blockquote>

## 通过串口对系统进行配置
硬件平台的配置需要通过串口连接，用户需要5V的USB-TTL串口连接线。
<blockquote>
USB-TTL串口连接线有多种电压选择，对于该硬件平台，请选择5V的电压，其他电压可能会无法和平台通信。
</blockquote>

用户需要将串口线的USB一端连接到PC，另一端连接到硬件平台，示意图如下：
<blockquote>
串口的TX端和平台的RX连接，串口的RX端和平台的TX连接。
</blockquote>
<br>
<img style="max-width: 800px; height: auto; " src="img/RectCreamSerialConnection.png"/>

当串口连接好后，用户即可通过串口和硬件平台交互，串口的波特率设置为9600 bit/s，包含八个数据位，无奇偶校验，一个停止位。

<blockquote>
<p>Linux用户: 可使用<a href="https://www.runoob.com/linux/linux-comm-screen.html">screen命令</a>，<a href="https://www.jianshu.com/p/54005e3095f3">socat命令</a>等进行串口通信。</p>
<p>
比如，<b>echo "VERSION" | socat - /dev/ttyUSB0,crnl</b> 可以从串口读取硬件平台版本信息。
</p>
<p>Windows用户: 需下载串口调试软件，如<a href="https://dl.pconline.com.cn/download/2335414.html">串口调试助手</a>。</p>
</blockquote>

<a href="download/锐客创新系统配置命令.pdf" download="锐客创新系统配置命令.pdf">下载：【配置命令集】</a>


# 通过SD卡对系统进行配置
<p>用户可将系统配置文件存储在SD卡上的<b>system</b>文件夹，并将文件命名为<b>config.json</b>，系统上电后会自动读取该文件的内容并对硬件进行相应的配置。</p>
<blockquote>
目前SD卡只支持FAT32文件系统，块的大小为固定的512字节。
</blockquote>
<p>以下例子为<b>config.json</b>的内容，可以将硬件平台的IP地址设置为192.168.1.101，子网掩码设置为255.255.255.0，网关地址设置为192.168.1.1，mdns名称设置为station，输出电压设置为15V。</p>

<pre>
{
  "ip": "192.168.1.101",
  "netmask": "255.255.255.0",
  "gateway": "192.168.1.1",
  "mdns": "station",
  "voltage": "15v"
}
</pre>
