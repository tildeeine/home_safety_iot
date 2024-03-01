# Ambient Intelligence Project - Health Monitoring System
## Project instructions
To run the React app locally to see the dashboard, use the following command:

```sh
npm start
```

## Progress plan
**Project base setup: 26 Feb - 3 Mar**
- Get the Raspberry Pi (RPi) device
- Set up the RPi for development (dev environment and internet connection)
- Make mockup of dashboard design
- Start development of webpage frontend
- Set up a way to publicly host the dashboard

End of week milestones: 
- Have RPi up and running
- Have dashboard design ready

**Sensor and dashboard setup: 4 Mar - 10 Mar**
- Connect the heat sensor to the RPi and verify that RPi correctly receives data
- Connect the camera to the RPi and verify that RPi correctly receives device data
- Connect the speaker to the RPi and verify that RPi correctly receives device data
- Connect the killswitch mechanism’s motor to RPi and verify that we can activate it
- Start development of RPi program to receive and process data from the connected devices, and transferring it to the web dashboard backend
- Start development of dashboard backend to receive data from RPi and process it to be displayed on frontend
- Verify that backend and frontend work well together

End of week milestones: 
- Finish frontend development
- Have all RPi-connected devices up and running
- Be able to communicate with dashboard from RPi

**Finish system functionality: 11 Mar - 17 Mar**
- Build the prototype room 
- Setup the RPi-connected devices in the prototype room
- Implement dashboard functionality for allowing users to manually set the alert and killswitch timers 
- Continue work on RPi functionality
- Start work on project report

End of week milestones: 
- Have the prototype room ready for demo, with sensors
- Have all dashboard functionality finished
- Have all RPi functionality finished

**Delivery week: 18 Mar - 24 Mar**
- Last touches on project code
- Finish project report
Project delivery **20th of march**, report delivery **22nd of march**



## Solution
The proposed solution aims to provide real-time monitoring of potentially dangerous home appliances, through sensors and cameras, to reduce risk of damages and alleviate anxiety for both the primary user and their caregivers. By enabling remote killswitch functionality, the system offers increased safety and reassurance.


## Requirements
**R1:** The system must be able to detect a heat source.

**R2:** The system must be able to produce sound signals to alert users of a possible issue.

**R3:** The system must be able to provide real-time camera updates to monitor appliances.

**R4:** The system must be able to deactivate an appliance upon detection of a possible issue.

**R5:** There should be a user-friendly dashboard to allow users to see monitoring information.

**R6:** The user interface should let the user set the specific parameters for system alarms.

**R7:** Sensor information must be correctly and effectively communicated to the dashboard.

**R8:** The user must be able to activate the kill switch through the user interface.
