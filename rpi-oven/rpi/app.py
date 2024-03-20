from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import serial
import time
from threading import Thread

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Setup serial connection to Arduino
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ser.flush()

# Initialize global variables
latest_temp = 0  # Store the latest temperature reading
temp_threshold = 80  # Temperature threshold for alerts

default_timer_duration = 3
current_timer_duration = default_timer_duration
timer_end_time = time.time() + default_timer_duration

alert_status = 0

@app.route('/temperature', methods=['GET', 'POST'])
def temperature():
    """Endpoint to get or update the latest temperature reading."""
    global latest_temp
    if request.method == 'POST':
        data = request.json
        latest_temp = data.get('temperature', 0)
        return Response("Temperature updated", status=200)
    else:
        return jsonify({"temperature": latest_temp})

@app.route('/alert_time', methods=['GET', 'POST'])
def alert_time():
    """Endpoint to get or update the alert timer duration."""
    global current_timer_duration, timer_end_time, default_timer_duration

    if request.method == 'POST':
        data = request.json
        try:
            new_duration = int(data['duration'])
            if new_duration > 0:
                timer_end_time += (new_duration-current_timer_duration)
                print("New end time:", timer_end_time)


                current_timer_duration = new_duration 
                print("Updated oventimer duration to:", new_duration, " seconds")
                return jsonify({"message": "Alert time updated successfully", "duration": new_duration}), 200
            else:
                return jsonify({"message": "Invalid duration provided"}), 400
        except (ValueError, KeyError, TypeError):
            return jsonify({"message": "Error processing request"}), 400
    else:
        return jsonify({"duration": current_timer_duration // 60}), 200 
    
@app.route('/killOven', methods=['POST'])
def killOven():
    """Endpoint to turn off oven."""
    try:
        # send signal through serial to turn off oven
        ser.write(b'B')

        return jsonify({"message": "Appliance turned off successfully"}), 200
    except (ValueError, KeyError, TypeError):
        return jsonify({"message": "Error processing request"}), 400
    
@app.route('/alert_status', methods=['GET'])
def get_alert_status():
    global alert_status
    print("Alerts: ", alert_status)

    """Endpoint to get the current temperature alert status."""
    return jsonify({"alert": alert_status})

def monitor_temperature():
    """Function to continuously monitor the temperature from the Arduino."""
    global latest_temp, alert_status, temp_threshold, timer_end_time
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            try:
                parts = line.split(' ')
                if len(parts) >= 2 and parts[0] == "Temperature:":
                    temp = float(parts[1].replace('C', ''))
                    latest_temp = temp
                    print("Temperature:", temp)
                    
                    if temp > temp_threshold and time.time() >= timer_end_time:
                        print("ALERT: Temperature too high for too long!")
                        alert_status += 1
                        ser.write(b'A')  
                    elif temp <= temp_threshold:
                        alert_status = 0
                        reset_timer()
                    else:
                        print("Checked end time: ", timer_end_time)

            except ValueError:
                print(f"Error converting temperature value: {line}")
        time.sleep(1)

def reset_timer():
    """Function to reset the alert timer."""
    global timer_end_time, current_timer_duration
    timer_end_time = time.time() + current_timer_duration

def start_sensor_processing():
    """Wrapper function to start sensor processing in a thread."""
    monitor_temperature()

if __name__ == '__main__':
    sensor_thread = Thread(target=start_sensor_processing, daemon=True)
    sensor_thread.start()

    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
