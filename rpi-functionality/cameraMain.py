import pyb, time
led = pyb.LED(3)
usb = pyb.USB_VCP()
while (usb.isconnected()==True):
   led.on()
   time.sleep_ms(150)
   led.off()
   time.sleep_ms(100)
   led.on()
   time.sleep_ms(150)
   led.off()
   time.sleep_ms(600)
import network
import time
SSID = "Francisca_Silva_iPhone"
KEY = "qualquercoisaserve"
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, KEY)
while not wlan.isconnected():
	print('Trying to connect to "{:s}"...'.format(SSID))
	time.sleep_ms(1000)
print("WiFi Connected ", wlan.ifconfig())
led = pyb.LED(3)
while (True):
   led.on()
   time.sleep_ms(150)
   led.off()
   time.sleep_ms(100)
   led.on()
   time.sleep_ms(150)
   led.off()
   time.sleep_ms(600)