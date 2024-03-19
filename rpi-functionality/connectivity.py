from gpiozero import Button
from signal import pause

# Define the GPIO pin number you're using
input_pin = 18

# Setup the button with pull-up resistor (assuming the cable provides connection to GND)
button = Button(input_pin, pull_up=True)

# Define a function to print the cable status
def print_cable_status():
    if button.is_pressed:
        print("Cable connected")
    else:
        print("Cable disconnected")

# Print the initial status
print_cable_status()

# When the button state changes, print the updated status
button.when_pressed = lambda: print_cable_status()
button.when_released = lambda: print_cable_status()

# Keep the program running
pause()
