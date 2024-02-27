from flask import Flask
import asyncio

app = Flask(__name__)

# HTTP
host = "localhost"
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