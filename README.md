# Home Security Monitoring
<!---
Begin with an introductory paragraph that tells readers the purpose of your solution with hardware and software and its major benefits. 
Give them a summary of the information you will include in this file using clearly defined sections.
-->
Ambient Intelligence (AmI) is a technology that enables simplification and automation of our everyday lives through the use of sensors embedded in our environment. One specific use area for this technology is to allow at-risk individuals to live independently and safely at home for longer. For our project, we have chosen to focus on individuals with memory impairments or attention deficit disorders.  

## General Information
<!---
This section expands on the introductory paragraph to give readers a better understanding of your project. 
Include a brief description and answer the question, "what problem does this project solve?"
-->
Our project entails two components focusing on equipment monitoring. The first component is a oven monitoring system. A heat source is used to surveill the oven. If the oven has been on for an extended period a warning will display on a webpage. If the warning is not acted upon, the system will activate a kill switch to turn of the oven. 

The second component is a door monitoring system. Its purpose will be to alert the user if the front door remains open for an extended period. Real-time updates on the status of the door will be displayed on the web-page. To monitor the door, it is used an electric circuit that is closed whenever the door is closed, so that one can detect if there is any current in the circuit or not. 

## Built With
<!---
Include an outline of the technologies in the project, such as hardware components (Arduino/Raspberry Pi), operating systems, programming language, database, libraries.

Include links to any related projects (for example, whether this API has corresponding iOS or Android clients), links to online tools related to the application (such as the project web site, the shared file storage).
If you mention something, please provide links.
-->
### Hardware

* [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) - 1 unit - Development board for reading sensors and sending this information to our dashboard.
* [Raspberry Pi 3](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/) - 1 unit - Development board for reading "door input", illustrated through an open/close circuit, and sending this information to our dashboard. 
* [Arduino starter kit](https://store.arduino.cc/collections/kits/products/arduino-starter-kit-multi-language) - Includes a range of the components we used for development. More specifically, we used the following components from the starter kit:
    * Arduino uno
    * Breadboard
    * Buzzer
    * Jumper wires 
    * Resistor 1K ohm
    * Temperature sensor
    * Transistor 
    * USB cable 

* [Nicla Vision](https://store.arduino.cc/products/nicla-vision) - 1 unit - Used for visual monitoring of the stovetop
* Assorted cables:
    * 2 RPi power cables
    * 1 Arduino USB power connector
    * 1 MicroUSB to USB for Nicla Vision

### Software

* [Raspberry Pi OS](https://www.raspberrypi.com/software/) - Operating system
* [Python]() - Programming language for RPi and Nicla Vision
* [Reference]() - Programming language for Arduino
* [Flask]() - Web framework, used for building API
* [React]() - Web framwork, used for building frontend
* [Tailwindcss]() - CSS framework for simplifying design of frontend


## Getting Started

These instructions will get you a copy of the project up and running on for testing purposes.  

1) Set up the physical system 

 <img src="image.png" alt="Buzzer Circuit" width="300">

2) Clone the repository from github using ssh
3) Install required packages (visible under "Software Prerequisities") (not sure if this is needed?)
4) If there has been made any changes to the arduino code, a compile and upload is necessary. This must be done inside the folder /arduino:
```
sudo ./arduino-cli compile --fqbn arduino:avr:uno start_buzzer/
sudo ./arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:avr:uno start_buzzer/
```
If you have issues with this you could try to list the board to check if its name has changed from ttyACM0 to something else, as this happens from time to time: 
`
sudo ./arduino-cli board list
`

For further information about the arduino-cli commands see: https://www.caronteconsulting.com/en/news/how-to/raspberry-arduino-cli/

5) Identify IP adresses for both RPis and the camera. HOW? Identify your mobile network name and password. This information should be added to the file called "network_info.json" in the following format:
    {
        "SSID": "",
        "password": "",
        "OvenRPiIP": "",
        "DoorRPiIP": "",
        "CameraIP": ""
    }


### Assembly Instructions
<!---

Describe step-by-step assembly instructions.

When necessary, and especially when wiring is involved, include diagrams/photos.

Page for creating diagrams:
https://www.circuito.io/app?components=512,11021,333429

------
####
-->
#### Starting the system when all installments has been done

<!---
Comment from Tuva: This section needs to be updated to include the last changes, not sure how they are (the virtual env and stuff)
--->

Navigate to the folder where you have cloned the github repository. 

Connect both RPis to your mobile network by writing the following in two different terminals:
```
ssh g14@<IP address of respective RPi>
```

Then enter the password 
`
g14
`

Run the file for the oven monitoring
`
python app.py
`

Run the file for the door monitoring
`
python door.py
`



### Software Prerequisites

- OpenMV for programming nicla vision
- Arduino IDE for programming arduino
- Some IDE on your computer to program RPis
- Libraries and dependencies
    - flask
    - flask_corse
    - gpiozero
    - network
    - sensor
    - serial
    - signal
    - socket
    - threading
    - time

- Node package manager

In this section include detailed instructions for installing additional software the application is dependent upon (such as PostgreSQL database, for example).
```sh
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/react-fontawesome
npm install react
source tutorial-env/bin/activate
```

### Installation

Give step-by-step instructions on building and running the application on the testing environment. 

Describe the step.

```
Give the command example
```

And repeat.

```
until finished
```

You can also add screenshots to show expected results, when relevant.

### Testing

Explain how to run the tests for this system.

Give users explicit instructions on how to run all necessary tests. 

Explain what these tests do and why

```
Give an example command
```

## Demo

Give a tour of the best features of the application.
Add screenshots when relevant.

## Additional Information

### Authors

Francisca Silva

Tilde Eine

Tuva Tholo