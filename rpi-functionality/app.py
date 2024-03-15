from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import serial
import time
from threading import Thread

# Flask setup
app = Flask(__name__)
CORS(app)  # Enable CORS

# Setup serial connection (adjust to your Arduino's serial port)
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ser.flush()

# Default timer duration in seconds (1 hour)
default_timer_duration = 3 #60*60 #! test values
timer_end_time = time.time() + default_timer_duration

# Global variables to keep last reading
latest_temperature = 0
temp_alert_status = 0
temp = 0 #! start value

@app.route('/temp_alert_status', methods=['GET'])
def get_alert_status():
    return jsonify({"alert": temp_alert_status})

@app.route('/alert_time', methods=['GET', 'POST'])
def alert_time():
    global default_timer_duration
    if request.method == 'POST':
        # Update the alert time
        data = request.json
        try:
            new_duration = int(data['duration'])
            if new_duration > 0:  # Basic validation
                default_timer_duration = new_duration*60  # Convert minutes to seconds
                return jsonify({"message": "Alert time updated successfully", "duration": new_duration}), 200
            else:
                return jsonify({"message": "Invalid duration provided"}), 400
        except (ValueError, KeyError, TypeError):
            return jsonify({"message": "Error processing request"}), 400
    else:
        # GET request - Return the current alert time
        return jsonify({"duration": default_timer_duration}), 200

@app.route('/temperature', methods=['GET', 'POST'])
def temperature():
    global latest_temperature
    if request.method == 'POST':
        # Update the latest temperature with the data received from the POST request
        data = request.json
        latest_temperature = data.get('temperature')
        return Response("Temperature updated", status=200)
    else:
        # Return the latest temperature reading
        return jsonify({"temperature": latest_temperature})
    
@app.route('/adjust_timer', methods=['POST'])
def adjust_timer():
    global default_timer_duration
    data = request.json
    new_duration = data.get('duration')
    if new_duration and isinstance(new_duration, int):
        default_timer_duration = new_duration
        return jsonify({"message": "Timer duration updated successfully", "duration": new_duration}), 200
    else:
        return jsonify({"message": "Invalid duration provided"}), 400

# Function to monitor temperature
def monitor_temperature():
    global latest_temperature, temp_alert_status, timer_end_time, temp
    while True:
        if ser.in_waiting > 0:
            temp_str = ser.readline().decode('utf-8').rstrip()
            #temp_str = ser.readline().decode().strip()
            try:
                while True:
                    if ser.in_waiting > 0:
                        #line = ser.readline().decode().strip()
                        line = ser.readline().decode('utf-8').rstrip()
                        # Assuming the line is something like "Temperature: 23.5C"
                        # Split the line by spaces and take the second element (the temperature)
                        parts = line.split(' ')

                        if len(parts) >= 2 and parts[0] == "Temperature:":
                            # Convert the temperature part to float
                            temp_str = parts[1].replace('C', '')  # Remove the 'C' at the end
                            temp = float(temp_str)
                            latest_temperature = temp
                            print("Temperature:", temp)
                        else:
                            print("Invalid data:", line)
                
                        # Logic for temperature alerts
                        if temp > 40:
                            # Check if the duration has passed
                            if time.time() >= timer_end_time:
                                print("ALERT: Temperature too high for too long!")
                                temp_alert_status +=1
                                ser.write(b'B')
                                # Reset the timer or take necessary actions
                                reset_timer()

                        else:
                            # Reset the timer if temperature goes below threshold
                            reset_timer()
                            temp_alert_status = 0
            except ValueError:
                # Handle possible conversion error if temp_str is not a float
                print(f"Error converting temperature value: {temp_str}")
        time.sleep(1)

# Function to reset the timer
def reset_timer():
    global timer_end_time
    timer_end_time = time.time() + default_timer_duration



def main():
    while True:
        # Read and process data from other sensors
        process_sensor_data()

        # This delay helps to prevent the loop from running too fast and overwhelming your RPi or the network.
        time.sleep(10)

def process_sensor_data():
    # Handling sensor data
    monitor_temperature()

    # Add other handling

def turn_off_alarm():
    ser.write(b'A')


if __name__ == '__main__':
    # Run Flask app
    # Note: use_reloader=False to prevent the sensor monitoring thread from starting twice
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
    # Start sensor reading in a background thread
    # Starting the temperature monitoring in a separate thread
    main()
