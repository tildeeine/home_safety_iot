from flask import Flask, jsonify, request
from gpiozero import Button
from signal import SIGTERM, signal
import threading
import time

app = Flask(__name__)

# GPIO setup
input_pin = 18
button = Button(input_pin, pull_up=True)

# Initialize global variables for the door status and alert timer
door_status = "closed"  # Default status
default_door_timer_duration = 4  # 4 sec, test value
timer_end_time = time.time() + default_door_timer_duration
alert_status = 0

def door_monitor():
    global door_status
    while True:
        door_status = "open" if not button.is_pressed else "closed"
        print(f"Door status: {door_status}")
        time.sleep(1)  # Check every second

@app.route('/alert_time/door', methods=['GET', 'POST'])
def door_alert_time():
    global default_door_timer_duration, timer_end_time
    if request.method == 'POST':
        data = request.json
        try:
            new_duration = int(data['duration'])
            if new_duration > 0:
                default_door_timer_duration = new_duration * 60
                timer_end_time = time.time() + default_door_timer_duration
                return jsonify({"message": "Door alert time updated successfully", "duration": new_duration}), 200
            else:
                return jsonify({"message": "Invalid duration provided"}), 400
        except (ValueError, KeyError, TypeError):
            return jsonify({"message": "Error processing request"}), 400
    else:
        return jsonify({"duration": default_door_timer_duration // 60}), 200

@app.route('/alert_status/door', methods=['GET'])
def door_alert_status():
    global alert_status
    # Example logic to determine alert status based on door status and timer
    current_time = time.time()
    if door_status == "open" and current_time >= timer_end_time:
        alert_status = 1  # Alert triggered
    else:
        alert_status = 0  # No alert
    return jsonify({"alert": alert_status})


@app.route('/door_last_opened', methods=['GET'])
def door_last_opened():
    global timer_end_time
    return jsonify({"last_opened": timer_end_time})#!wrong, just for testing

def start_flask_app():
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)

if __name__ == '__main__':
    # Start the door monitor in a background thread
    door_thread = threading.Thread(target=door_monitor, daemon=True)
    door_thread.start()
    
    # Start Flask app
    flask_thread = threading.Thread(target=start_flask_app)
    flask_thread.start()

    # Ensure clean exit on SIGTERM (e.g., from a system service stop)
    def handle_sigterm(*args):
        raise SystemExit
    
    signal(SIGTERM, handle_sigterm)
