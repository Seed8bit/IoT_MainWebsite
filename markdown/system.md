# 系统
## 软硬件架构

### 硬件

硬件平台主要包括一枚8-bit MCU；存储包括板上512KB的SRAM和SD卡；通信提供100mbps的以太网以及USB Type C供电。

另外，我们也为用户提供了可以精确到秒的时间控制模块。

<blockquote>
值得注意的是，主控为5V工作电压，即I2C, UART, SPI等外设的工作电压一般为5V（例外：如ADC，可以设置不同的参考电压）。因此，在连接不同的外部传感器时，需要确定传感器兼容5V供电。
</blockquote>

下图表示了目前硬件系统的基本架构：
<br>
<img style="max-width: 800px; height: auto; " src="img/RectCreamHardwareStructure.png"/>

### 软件

软件系统包括对各种硬件模块的驱动，操作指令的解析，文件系统和HTTP静态服务器等。

下图表示了目前软件系统的基本架构：
<br>
<img style="max-width: 800px; height: auto; " src="img/RectCreamSoftwareStructure.png"/>

## 引脚分布图
下图展示了硬件平台的引脚信息：
<br>
<img style="max-width: 600px; height: auto; " src="img/RUIKECHUANGXIN_pinout.png"/>



