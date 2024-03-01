# Handles the sensor interaction and main RPi functionality
from gpiozero import Button

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# GPIO pins for the oven system
heat_sensor_pin = 17
speaker_pin = 18
camera_pin = 27
killswitch_pin = 22
button_pin = 23 
# ! Replace with correct pins when connected

# Initialize sensors. Replace with actual sensor objects once we know type of sensors
heat_sensor_status = 0
speaker_status = 0
camera_status = 0
killswitch_status = 0
reset_button = Button(button_pin)  # Manual reset button

# Set up the GPIO pins #! Not sure if needed
GPIO.setup(heat_sensor_pin, GPIO.IN)
GPIO.setup(speaker_pin, GPIO.OUT)
GPIO.setup(camera_pin, GPIO.IN)
GPIO.setup(killswitch_pin, GPIO.OUT)

# Default timer duration in seconds
default_timer_duration = 60*60 # 1 hour
timer_end_time = time.time() + default_timer_duration

# Function to reset the timer
def reset_timer():
    global timer_end_time
    timer_end_time = time.time() + default_timer_duration

# Main loop to continously read sensor data
while True:
   # Read heat sensor data
   heat_sensor_status = GPIO.input(heat_sensor_pin)

   # Capture an image from the camera every few seconds
   camera_status = GPIO.input(camera_pin)
   time.sleep(5)  # Adjust time as needed

   







   # Set up for reading connected device data, but without logic
   heat_data = heat_sensor.value
   camera.capture('image.jpg')
   killswitch.move()
   speaker.play('sound.mp3')

   # Add logic to send data to backend.py
   time.sleep(1)  # Add appropriate delay
