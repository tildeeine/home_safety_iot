import serial
import time

# Setup serial connection (adjust to your Arduino's serial port)
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ser.flush()


try:
    while True:
        print(ser.in_waiting)
        # Send command to Arduino
        command = input("Enter command (A/B): ")
        ser.write(command.encode())

        # Wait for response from Arduino
        response = ser.readline().decode().strip()
        print("Arduino Response:", response)
except KeyboardInterrupt:
    print("Exiting...")
finally:
    ser.close()