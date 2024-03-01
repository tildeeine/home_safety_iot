from flask import Flask, jsonify, request
import requests
import asyncio

app = Flask(__name__)

# HTTP
DASHBOARD_URL = "localhost"
port = 3000

@app.get("/oven")
def get_alert_timer() -> int:
    return alert_timer

@app.post("/oven")
def alert_oven_on() -> None:
    # Send notification to dashboard (publish)
    notifications.append("The oven is on!")

@app.post("/oven")
def turn_oven_off() -> None:
    # Send notification to dashboard (publish)
    notifications.append("Turning oven off")
    # TODO add actions to turn off oven

# Endpoint to send heat sensor data
@app.route('/api/heat', methods=['POST'])
def send_heat_data():
    data = request.get_json()
    # Process data and send it to the dashboard
    requests.post('DASHBOARD_URL/heat', json=data)
    return jsonify({'success': True})

# Notification handling
notifications = []

@app.get("/notifications")
def get_notifications() -> List[str]:
    return notifications

async def send_notifications():
    while True:
        if notifications:
            # Send notifications to dashboard (publish)
            print(notifications)
            notifications.clear()
        await asyncio.sleep(1)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)