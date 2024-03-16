import sensor
import time
import network
import socket

SSID = "Eine"  # Network SSID
KEY = "Tilde123"  # Network key
HOST = ''  # Use first available interface (listen on all interfaces)
PORT = 8080  # Arbitrary non-privileged port

# Init sensor
sensor.reset()
sensor.set_framesize(sensor.QVGA)
sensor.set_pixformat(sensor.RGB565)

# Init wlan module and connect to network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, KEY)

while not wlan.isconnected():
    print('Trying to connect to WiFi network "{}"...'.format(SSID))
    time.sleep(1)  # Wait for connection to establish

print("WiFi Connected:", wlan.ifconfig())

# Create server socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind((HOST, PORT))
s.listen(5)
print("Listening on {}:{}".format(HOST, PORT))

def start_streaming(s):
    while True:
        client, addr = s.accept()
        print("Connected to {}:{}".format(addr[0], addr[1]))
        client.settimeout(5.0)  # Set timeout for client socket

        # Send multipart header
        client.sendall(
            b"HTTP/1.1 200 OK\r\n"
            b"Server: NiclaVision\r\n"
            b"Content-Type: multipart/x-mixed-replace;boundary=frame\r\n\r\n"
        )

        try:
            while True:
                # Take a picture
                frame = sensor.snapshot()

                # Compress the image
                buf = frame.compress(quality=35)

                # Prepare and send the multipart response
                header = (
                    b"--frame\r\nContent-Type: image/jpeg\r\nContent-Length: "
                    + str(len(buf))
                    + b"\r\n\r\n"
                )

                client.sendall(header + buf)
                print("Sent")

        except Exception as e:
            print("Connection closed:", e)
        finally:
            client.close()

while True:
    try:
        start_streaming(s)
    except Exception as e:
        print("Restarting stream due to error:", e)
