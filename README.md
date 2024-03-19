# Home Security Monitoring

Begin with an introductory paragraph that tells readers the purpose of your solution with hardware and software and its major benefits. 
Give them a summary of the information you will include in this file using clearly defined sections.

## General Information

This section expands on the introductory paragraph to give readers a better understanding of your project. 
Include a brief description and answer the question, "what problem does this project solve?"

## Built With

Include an outline of the technologies in the project, such as hardware components (Arduino/Raspberry Pi), operating systems, programming language, database, libraries.

Include links to any related projects (for example, whether this API has corresponding iOS or Android clients), links to online tools related to the application (such as the project web site, the shared file storage).
If you mention something, please provide links.

### Hardware

* [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) - 1 unit - Development board for reading sensors and sending this information to our dashboard.
* [Raspberry Pi 3](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/) - 1 unit - Development board for reading "door input", illustrated through an open/close circuit, and sending this information to our dashboard. 
* [Arduino starter kit](https://store.arduino.cc/collections/kits/products/arduino-starter-kit-multi-language) - Includes a range of the components we used for development. More specifically, we used the following components from the starter kit:
    * Buzzer
    * Temperature sensor
    * Arduino
    * Breadboard, cables, jumper wire connectors
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

- set up the physical system (ADD DIAGRAM)
- clone the repository from github using ssh
- install required packages (visible under "Software Prerequisities")

### Assembly Instructions

Describe step-by-step assembly instructions.

When necessary, and especially when wiring is involved, include diagrams/photos.

Page for creating diagrams:
https://www.circuito.io/app?components=512,11021,333429

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

In this section include detailed instructions for installing additiona software the application is dependent upon (such as PostgreSQL database, for example).
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

Add our names here. 