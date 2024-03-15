from flask import Flask, jsonify, request
from threading import Thread, Lock
import serial
import time
from threading import Thread

# Flask setup
app = Flask(__name__)

# Setup serial connection (adjust to your Arduino's serial port)
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ser.flush()

# Default timer duration in seconds (1 hour)
default_timer_duration = 3 #60*60 #! test values
timer_end_time = time.time() + default_timer_duration

# Function to monitor temperature
def monitor_temperature():
    print("inside monitor_temperature()")
    while True:
        print("in waiting:", ser.in_waiting)
        if ser.in_waiting > 0:
            temp_str = ser.readline().decode('utf-8').rstrip()
            #temp_str = ser.readline().decode().strip()
            try:
                while True:
                    if ser.in_waiting > 0:
                        print("inside in_waiting")
                        #line = ser.readline().decode().strip()
                        line = ser.readline().decode('utf-8').rstrip()
                        print("reading input from rpi")
                        # Assuming the line is something like "Temperature: 23.5C"
                        # Split the line by spaces and take the second element (the temperature)
                        parts = line.split(' ')
                        #print(parts)
                        if len(parts) >= 2 and parts[0] == "Temperature:":
                            # Convert the temperature part to float
                            temp_str = parts[1].replace('C', '')  # Remove the 'C' at the end
                            temp = float(temp_str)
                            print("Temperature:", temp)
                        else:
                            print("Invalid data:", line)
                
                        # Logic for temperature alerts
                        if temp > 40:
                            # Check if the duration has passed
                            if time.time() >= timer_end_time:
                                print("ALERT: Temperature too high for too long!")
                                ser.write(b'B')
                                # Reset the timer or take necessary actions
                                reset_timer()
                                # Send alert to dashboard 
                                send_alert_to_dashboard() # Add endpoint and other necessary logic after testing
                        else:
                            # Reset the timer if temperature goes below threshold
                            reset_timer()
            except ValueError:
                # Handle possible conversion error if temp_str is not a float
                print(f"Error converting temperature value: {temp_str}")
        time.sleep(1)

# Function to reset the timer
def reset_timer():
    global timer_end_time
    timer_end_time = time.time() + default_timer_duration

# Starting the temperature monitoring in a separate thread
temp_thread = Thread(target=monitor_temperature)
temp_thread.daemon = True  # Daemonize thread
temp_thread.start()

def main():
    while True:
        # Check for and process any commands from the dashboard
        check_for_dashboard_alerts()

        # Read and process data from other sensors
        process_sensor_data()

        # This delay helps to prevent the loop from running too fast and overwhelming your RPi or the network.
        time.sleep(10)

def run_app():
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)

def process_sensor_data():
    # Handling sensor data
    monitor_temperature()

    # Add other handling

def turn_off_alarm():
    ser.write(b'A')
    

def check_for_dashboard_alerts():
    # This function checks for any commands from the dashboard, like changing the alert threshold
    try:
        print("Checking for dashboard commands...")
        response = request.get("http://DASHBOARD_URL/api/commands")
        if response.ok:
            commands = response.json()
            # Process commands here
    except Exception as e:
        print(f"Error checking for dashboard commands: {e}")

def send_alert_to_dashboard():
    print("Sending alert to dashboard...")
    # This function could be used to send periodic updates to the dashboard,
    # such as the current temperature, the oven's state, or any alerts.
    try:
        # For simplicity, assuming you have an endpoint to update dashboard info
        response = request.post("http://DASHBOARD_URL/api/update", json={"temp"})
        if not response.ok:
            print("Failed to update dashboard")
    except Exception as e:
        print(f"Error updating dashboard: {e}")

if __name__ == '__main__':
    # Start sensor reading in a background thread
    sensor_thread = Thread(target=process_sensor_data(), daemon=True)
    sensor_thread.start()

# # Set up the GPIO pins #! Not sure if needed
# GPIO.setup(heat_sensor_pin, GPIO.IN)
# GPIO.setup(speaker_pin, GPIO.OUT)
# GPIO.setup(camera_pin, GPIO.IN)
# GPIO.setup(killswitch_pin, GPIO.OUT)

# # Capture an image from the camera every few seconds
# camera_status = GPIO.input(camera_pin)
# time.sleep(5)  # Adjust time as needed
    
# # Set up for reading connected device data, but without logic
# heat_data = heat_sensor.value
# camera.capture('image.jpg')
# killswitch.move()
# speaker.play('sound.mp3')
