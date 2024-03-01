import time
from gpiozero import MotionSensor
from picamera import PiCamera
from gpiozero import Button
from gpiozero import Servo
from pygame import mixer

# Initialize your sensors
heat_sensor = ...
camera = PiCamera()
robot_arm = Servo(17)  # Replace 17 with your GPIO pin for the robot arm
speaker = mixer

# Set default timer duration in seconds (e.g., 1 hour)
default_timer_duration = 3600
timer_end_time = time.time() + default_timer_duration

# Initialize button for manual reset
reset_button = Button(18)  # Replace 18 with your GPIO pin for the reset button

# Function to reset the timer
def reset_timer():
    global timer_end_time
    timer_end_time = time.time() + default_timer_duration

# Main loop to continuously monitor sensors
while True:
    # Read heat sensor data
    heat_data = heat_sensor.value

    # Capture an image from the camera every few seconds
    camera.capture('image.jpg')
    time.sleep(5)  # Adjust the interval as needed

    # Check if the timer has expired
    if time.time() >= timer_end_time:
        # Play a sound using the speaker
        speaker.init()
        speaker.music.load('alert.mp3')
        speaker.music.play()

        # Check for manual reset button press
        if reset_button.is_pressed:
            reset_timer()
        else:
            # Activate the killswitch (move the robot arm)
            robot_arm.max()
            time.sleep(5)  # Adjust the duration as needed
            robot_arm.detach()  # Detach to stop the arm
