import RPi.GPIO as GPIO
from flask import Flask, render_template, request

app = Flask(__name__)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# GPIO pins for the oven system
heat_sensor_pin = 17
speaker_pin = 18
camera_pin = 27
killswitch_pin = 22
# ! Not sure all of these will be pins? And don't know if they are the right pins

# Initialize GPIO status variables
heat_sensor_status = 0
speaker_status = 0
camera_status = 0
killswitch_status = 0

# Set up the GPIO pins
GPIO.setup(heat_sensor_pin, GPIO.IN)
GPIO.setup(speaker_pin, GPIO.OUT)
GPIO.setup(camera_pin, GPIO.IN)
GPIO.setup(killswitch_pin, GPIO.OUT)


if __name__ == "__main__":
   app.run(host='0.0.0.0', port=80, debug=True)