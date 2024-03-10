
from signal import pause
from gpiozero import LED, Button

button = Button(21)
led = LED(26)
led2 = LED(20)

led2.on()

try:
	led.source = button.values

	pause()

finally:
	pass
