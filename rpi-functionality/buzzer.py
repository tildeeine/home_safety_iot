from gpiozero import Buzzer, LED

bz = Buzzer(23)
bz.beep()
while True:
	print(bz.value)
