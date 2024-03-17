import sensor
import time
import network
import usocket as socket

SSID = "Eine"  # Network SSID
KEY = "Tilde123"  # Network key
HOST = ''  # Use first available interface (listen on all interfaces)
PORT = 8080  # Arbitrary non-privileged port

# Initialize the camera
sensor.reset()
sensor.set_framesize(sensor.QVGA)
sensor.set_pixformat(sensor.RGB565)

# Initialize WLAN module and connect to network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, KEY)

while not wlan.isconnected():
    print('Trying to connect to WiFi network "{}"...'.format(SSID))
    time.sleep(1)

print("WiFi Connected:", wlan.ifconfig())

# Create server socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind((HOST, PORT))
s.listen(5)
print("Listening on {}:{}".format(HOST, PORT))

def accept_conn(s):
    client, addr = s.accept()
    print("Connected to {}:{}".format(addr[0], addr[1]))
    client.settimeout(5.0)
    return client

def handle_client(client):
    try:
        request = client.recv(1024)
        if "GET /capture" in request.decode():
            # Take a picture
            img = sensor.snapshot()

            # Compress the image
            buf = img.compress(quality=35)
            
            # Prepare HTTP response
            response = b"HTTP/1.1 200 OK\r\n"
            response += b"Content-Type: image/jpeg\r\n"
            response += b"Content-Length: " + str(len(buf)) + b"\r\n"
            response += b"Access-Control-Allow-Origin: *\r\n\r\n"  # CORS header
            response += buf
            
            client.sendall(response)
        else:
            client.send(b"HTTP/1.1 400 Bad Request\r\n\r\n")
    except Exception as e:
        print("Error:", e)
    finally:
        client.close()

while True:
    client = accept_conn(s)
    handle_client(client)
