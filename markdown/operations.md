#### 硬件操控接口
主控使用5V电压输入，以下的硬件操作高电平即为5V，低电平为0V。
硬件接口定义在`actions`中，目前actions支持以下的操作：
##### GPIO
* 设置GPIO为输入：
  * ACTION 发送格式:

        ["gpio", {PIN_INDEX}, "input", {PULL_UP_RESISTOR_ENABLE}]
        说明：
        {PIN_INDEX}: 0 - 41
        {PULL_UP_RESISTOR_ENABLE}：1表示使用上拉电阻，0表示不使用

        以下的例子设置pin 10为输入，并且使用上拉电阻：
        ["gpio", 10, "input", 1]

  * ACTION 返回格式:

        [{PIN_STATE}]
        说明：1表示pin脚目前为高电平，0表示pin脚目前为低电平。
        比如返回如下值代表当前pin脚为低电平：
        [0]

* 设置GPIO为输出：
  * ACTION 发送格式：

        ["gpio", {PIN_INDEX}, "output", {MODE}]
        说明：
        {PIN_INDEX}：说明如上
        {MODE}: 可以选择如下
          0: 输出为高电平
          1：输出为低电平
          2：高低反转

        以下的例子设置pin 10输出低电平
        ["gpio", 10, "output", 0]


  * ACTION 返回格式：

        [{PIN_STATE}]
        说明：1表示pin脚目前为高电平，0表示pin脚目前为低电平。
        比如返回如下值代表当前pin脚为低电平：
        [0]

##### ADC
ADC使用10-bit的采样精度(0 - 1023)，参考电压可以在5V, 2.56V和1.1V之间选择。
* ACTION 发送格式

        {"adc", {ADC_CHANNEL_ID}, {VOLTAGE_REFERENCE}]
        说明：
        {ADC_CHANNEL_ID}: 选择ADC通道，0-15
        {VOLTAGE_REFERENCE}: 选择参考电压，可选5v, 2.56v或1.1v。(注意需要小写'v')

        以下的例子获得ADC通道1的值:
        ["adc", 1, "5v"]

* ACTION 返回格式

        [{ADC_VALUE}], 比如: [768], 通过计算 (ADC_VALUE / 1024) * VOLTAGE_REFERENCE 得到当前的电压值。

##### PWM
PWM可以在指定Pin脚输出特定频率和周期的方波，可以用来驱动电机，驱动蜂鸣器，调节LED灯的亮度等等。该系统有两条pwm相关命令，分别用来开启或者关闭PWM。系统支持对于一个周期，指定输出三个不同的频率，会有三个pin脚进行输出。
* 开启PWM
  * ACTION 发送格式：

        ["pwm", {TIMER_INDEX}, "enabled", {TIME_UNITS}, {PERIOD}, {DUTY_CYCLE_A}, {DUTY_CYCLE_B}, {DUTY_CYCLE_C}, {DURATION_IN_10MS}]
        说明：
        {TIMER_INDEX}: 计时器选择，目前可选0或者1
        {TIME_UNITS}: 时间单位选择，目前可选ms或者us
        {PERIOD}: 时间周期
        {DUTY_CYCLE_A}: PWM输出1的脉宽
        {DUTY_CYCLE_B}: PWM输出2的脉宽
        {DUTY_CYCLE_C}: PWM输出3的脉宽
        {DURATION_IN_10MS}: 该pwm输出的时间(单位是10ms)，如果输入负数如-1，则pin脚会持续输出PWM方波。

        以下的例子使用定时器0, 输出的周期为20ms，三个输出pin脚分别输出脉宽为8, 12, 15ms的方波，PWM输出持续1秒：
        ["pwm", 1, "enabled", "ms", 20, 8, 12, 15, 100]


  * ACTION 返回格式：

        [{STATUS}]: 如果pwm设置成功，则为"success"; 否则会返回失败原因

* 关闭PWM
  * ACTION 发送格式：

        ["pwm", {TIMER_INDEX}, "disabled"]
        说明：
        {TIMER_INDEX}: 计时器选择，目前可选t4或者t5

  * ACTION 返回格式：

        [{STATUS}]: 如果pwm设置成功，则为"success"; 否则会返回失败原因

##### SPI
系统提供SPI通信接口，由4条信号线组成，MISO, MOSI, SCK和CS信号。用户可自己定义大多数SPI模块的参数，包括速率，CS pin 脚，发送数据的顺序等等，该SPI模块可适应大多数支持SPI接口的外设。

* ACTION 发送格式：

        ["spi", {SPI_INDEX} {SPEED_LEVEL}, {CS_PIN}, {SAMPLE_MODE}, {MSB/LSB}, {RECEIVE_DATA_LENGTH}, {SEND_DATA_LENGTH}, {DATA_TO_SEND}]
        说明：
        {SPI_INDEX}: 板子有一个SPI通道，该参数需固定为0
        {SPEED_LEVEL}: SPI速率可选，可选0，1，2。
          0: 8Mbit/s
          1: 4Mbit/s
          2: 2Mbit/s
        {CS_PIN}: 参照GPIO部分，可选择任意pin脚
        {SAMPLE_MODE}: 设置采样的时间点
          "lr": 在第一个上升沿进行采样（发送数据）
          "tf": 在跟随的下降沿进行采样（发送数据）
          "lf": 在第一个下降沿进行采样（发送数据）
          "tr": 在跟随的上升沿进行采样（发送数据）
        {MSB/LSB}: 发送一个字节的数据是从低比特开始发送还是从高比特开始发送
          "msb"：从高比特开始发送数据
          "lsb"：从低比特开始发送数据
        {RECEIVE_DATA_LENGTH}: SPI需要接收多少字节的数据
        {SEND_DATA_LENGTH}：SPI需要发送多少字节的数据
        {DATA_TO_SEND}: SPI发送的数据 (可选)

        以下例子展示用每秒4 Mbit的速率发送0x1, 0x2, 0x3, 0x4到接收端，并返回10个从接收端返回的字节，CS pin脚是15：
        ["spi", 0, 1, 15, "lr", "msb", 10, 4, 1, 2, 3, 4]


* ACTION 返回格式：

        [{DATA_RECEIVED}]: 根据在发送请求里指定的接收字节数量，返回接收到的数据
        比如，如上的例子需从接收端返回10个字节的数据，从0到9，则返回数据为：
        [0,1,2,3,4,5,6,7,8,9]

##### UART
系统为用户提供了3个UART模块，每个模块可以独立运行，有多个波特率可选。如果需要接收端发回数据，用户需要指定最长的指定时间，系统会在发送完数据后等待接收端返回指定个数的数据，当接收到足够数量的数据后，系统会自动返回并发回数据；否则，系统会一直等待，直到最长的等待时间结束。
* ACTION 发送格式

        ["uart", {UART_INDEX}, {SPEED_SELECTION}, {PARITY_ENABLE}, {STOP_BIT},{DATA_SIZE}, {RECEIVE_TIME_OUT_SEC}, {RECEIVE_DATA_LENGTH}, {SEND_DATA_LENGTH}, {DATA_TO_SEND}]
        说明：
        {UART_INDEX}: UART ID选择，目前板子上有3个UART模块，可以选择1-3
        {SPEED_SELECTION}:　UART速率选择，可选9k/38k/115k
          9k对应的波特率：9600
          38k对应的波特率：38400
          115k对应的波特率：115200
        {PARITY_ENABLE}: 奇偶校验位
        　"disabled": 不使用校验
          "even":　使用偶校验
          "odd":　使用奇校验
        {STOP_BIT}:　停止位
          1: 1位停止位
          2: 2位停止位
        {DATA_SIZE}:　单次的数据大小
          可选5/6/7/8
        {RECEIVE_TIME_OUT_SEC}: 等待接收数据的最大时间(单位：秒)
        {RECEIVE_DATA_LENGTH}: 期待接收端返回的数据长度
        {SEND_DATA_LENGTH}:　发送的数据长度
        {DATA_TO_SEND}:　发送的数据

        比如，以下例子，用9600的波特率从模块2发送数据(1,2,3,4)到接收端，发送时不使用奇偶校验，1位停止位，8bit的数据包，并等待接收10字节的数据，最多等待5秒。
        ["uart", 2, "9k", "disabled", 1, 8, 5, 10, 4, 1, 2, 3, 4]

* ACTION 返回格式

        [{RECEIVED_DATA}]
        比如，以上的例子中，收到了10个字节的数据，为0, 1, 2, 3, 4, 5, 6, 7, 8, 9，则返回为：
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

##### I2C
系统提供了I2C模块，可以方便地向I2C外设发送数据。请注意，因为系统为5V系统，请确保外设支持5V的电压输入。
* I2C读操作
  * ACTION 发送格式

        ["i2c", {I2C_ID}, "read", {SPEED_IN_HUNDRED_KHZ}, {DEVICE_ADDRESS}, {REGISTER_ADDRESS}, {RECEIVE_DATA_LENGTH}]
        说明：
        {I2C_ID}: I2C模块选择，板子上有一个I2C模块，该参选只支持0
        {SPEED_IN_HUNDRED_KHZ}: I2C速度选择，可选1/2/3/4
          1: 100kHz
          2: 200kHz
          3: 300kHz
          4: 400kHz
        {DEVICE_ADDRESS}: 外设地址，请参考外设的技术手册
        {REGISTER_ADDRESS}: 如果需要发送外设的寄存器地址，可以在这里指定。如果不需要发送外设的寄存器地址，请在这里指定-1。
        {RECEIVE_DATA_LENGTH}：需要接收多少字节的数据

        比如，要用400kHz的速率读取I2C外设(地址0x21或十进制33)中的10个字节的数据(无寄存器地址)：
        ["i2c", 0, "read", 4, 33, -1, 10]

  * ACTION 返回格式

        [{RECEIVED_DATA}]
        比如，以上的例子中，收到了10个字节的数据，为0, 1, 2, 3, 4, 5, 6, 7, 8, 9，则返回为：
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

* I2C写操作
  * ACTION 发送格式

        ["i2c", {I2C_ID}, "write", {SPEED_IN_KHZ}, {DEVICE_ADDRESS}, {REGISTER_ADDRESS}, {SEND_DATA_LENGTH}, {DATA_TO_SEND}]
        说明：
        请参考以上读操作的说明。
        比如，要发送10个字节的数据(从0到9),到地址0x21或十进制33,使用相同的参数：
        ["i2c", 0, "write", 4, 33, -1, 10, 0, 1, 2, 3, 4, 5, 6, ,7 ,8, 9]


  * ACTION 返回格式

        返回空。即[]

##### File
系统提供文件系统，可进行文件的读写操作。
* 进行文件的读操作
  * ACTION 发送格式

        ["file", {FILE_ID}, "read", {FILE_NAME}]
        说明：
        {FILE_ID}: 文件ID, 该参数固定为0
        {FILE_NAME}:　文件名称

        以下例子读取test.txt文件：
        ["file", 0, "read", "test.txt"]

  * ACTION 返回格式

        {FILE_CONTENT}:　文件内容
        比如，test.txt文件中的内容为hellotest!，则返回数据为：
        {"hellotest!"}

* 进行文件的写操作
  * ACTION 发送格式

        ["file", {FILE_ID}, "read", {FILE_NAME},　{FILE_CONTENT}]
        说明：
        {FILE_ID}: 文件ID, 该参数固定为0
        {FILE_NAME}:　文件名称
        {FILE_CONTENT}: 文件内容

        以下例子将hellotest! 写入文件test.txt:
        ["file", "write", "test.txt", "hellotest!"]

  * ACTION 返回格式

        [ {WRITE_LENGTH} ]
        说明：
        {WRITE_LENGTH}: 返回写入文件中字节的数量
        比如，将hellotest!写入文件中，返回的内容为：
        [10]

##### RTC (Real Time Clock)
平台集成了RTC时钟单元帮助系统得到精确的时间信息。用户可以通过读命令得到当前的时钟信息，或通过写命令修改时钟信息。

系统的RTC模块需要有额外的纽扣电池供电，以确保在系统断电后，时钟也可以正常计时。请确保正确安装好纽扣电池。

* 时钟读取命令
  * ACTION 发送格式

        ["rtc", {RTC_ID}, "read"]
        说明：
        {RTC_ID}: RTC ID，该参数固定为0

        比如，发送如下的ACTION读取RTC的值：
        ["rtc", 0, "read"]

  * ACTION 返回格式

        [{YEAR}, {MONTH}, {DATE}, {HOUR}, {MINUTE}, {SECOND}]
        说明：
        {YEAR}: 数值是基于2000年
        {HOUR}: 24小时制
        比如，返回2020年，7月15号，14点35分10秒:
        [20, 7, 15, 14, 35, 10]

* 时钟修改命令
  * ACTION　发送格式

        ["rtc", {RTC_ID}, "write", {YEAR}, {MONTH}, {DATE}, {HOUR}, {MINUTE}, {SECOND}]
        说明：
        参数的介绍如上所述。
        比如，将RTC的时间修改为2015年，3月6号，8点48分21秒:
        ["rtc", 0， "write", 15, 3, 6, 8, 48, 21]

  * ACTION　返回格式

        当成功修改RTC后，返回空。即[]

### Web服务器
平台支持静态Web服务器，将HTML, JavaScript, CSS存在指定文件夹中，用户即可通过外部浏览器访问平台。
这些静态Web文件可以帮助用户可视化平台存储的数据，更好地与平台的硬件接口交互。

我们在IoT_WebApps中提供了丰富的例子，请访问 [IoT_WebApps仓库](https://github.com/Seed8bit/IoT_WebApps)。

### 文件结构
该平台将绝大多数数据储存于SD卡中，SD卡的文件结构如下：

* public

  该文件夹中存储所有的静态网页文件，当用户通过外部浏览器访问平台时，系统会到该文件中找到`index.html`并将其返回给用户浏览器。

* user

　该文件夹中存储所有用户自定义的文件，当用户需要存储自定义文件时(文件名由用户自己定义，比如写文件命令)，平台会将其存在该文件夹中。

* system

　该文件夹中存储所有系统定义的文件，比如`boot.json`，该文件当系统上电时会自动读取，并执行里面所定义的指令。

* firmware

　该文件夹中存储固件文件，Bootloader运行时会到该文件夹中寻找固件进行加载(如果不需要用户修改固件，可将该文件夹删除)。
