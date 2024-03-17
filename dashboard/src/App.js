import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import StatusCardOven from './StatusCardOven';
import DoorStatusCard from './StatusCardDoor';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { faFireBurner, faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons';


// Constants for API URLs
const RPI_SENSOR_IP = "172.20.10.14";
const RPI_SENSOR_PORT = "5000";
const RPI_SENSOR_URL = `http://${RPI_SENSOR_IP}:${RPI_SENSOR_PORT}`;

const RPI_DOOR_IP = "172.20.10.2"
const RPI_DOOR_PORT = "5000";
const RPI_DOOR_URL = `http://${RPI_DOOR_IP}:${RPI_DOOR_PORT}`;

const Status = {
  OK: 'OK',
  WARNING: 'Warning',
  PROBLEM: 'Problem'
};

function App() {
  // State hooks
  const [appliances, setAppliances] = useState({
    Oven: { temperature: 0, status: Status.OK, icon: faFireBurner, type: 'Oven', url: RPI_SENSOR_URL },
    Door: { isOpen: false, lastOpened: 'Not available', status: Status.OK, icon: faFireBurner, type: 'Door', url: RPI_DOOR_URL }, // Example of other appliance
    // Add other appliances as needed
  });
  const [doorStatus, setDoorStatus] = useState({
    isOpen: false,
    lastOpened: 'Not available'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // Handle card click events
  const handleCardClick = (appliance) => {
    const selectedApplianceInfo = appliances[appliance];
    setSelectedAppliance(selectedApplianceInfo);
    setIsModalOpen(true);
  };

  // Fetch data from server and update the relevant appliances
  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        axios.get(`${RPI_SENSOR_URL}/temperature`),
        axios.get(`${RPI_SENSOR_URL}/alert_status/oven`),
        axios.get(`${RPI_DOOR_URL}/alert_status/door`),
        axios.get(`${RPI_DOOR_URL}/door_last_opened`),
        axios.get(`${RPI_DOOR_URL}/alert_time/door`),
        // Add other endpoints as needed for different appliances
      ]);
      const tempResponse = responses[0];
      const ovenAlert = responses[1];
      const doorOpenStatus = responses[2];
      const lastOpened = responses[3];
      const doorTimer = responses[4];

      const determineStatus = (count) => {
        if (count >= 2) return Status.PROBLEM;
        if (count === 1) return Status.WARNING;
        return Status.OK;
      };

      // Update only inputs and status'
      setAppliances(prevAppliances => ({
        ...prevAppliances,
        Oven: {
          ...prevAppliances.Oven,
          temperature: tempResponse.data.temperature, // Assuming tempResponse.data contains the temperature
          status: determineStatus(ovenAlert.data.alert), // Assuming ovenAlert.data contains the alert status
        },
        Door: {
          ...prevAppliances.Door,
          isOpen: doorOpenStatus.data.isOpen, // Assuming doorOpenStatus.data contains the open status
          lastOpened: lastOpened.data.lastOpened, // Assuming lastOpened.data contains the last opened time
          status: determineStatus(doorOpenStatus.data.alert), // Assuming doorAlert.data contains the alert status for the door
        }
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // // Fetch the latest image from camera
  // useEffect(() => {
  //   const fetchImage = async () => {
  //     const imageUrl = `${NICLA_VISION_URL}/latest-image`;
  //     setImageUrl(`${imageUrl}?t=${new Date().getTime()}`); // Cache busting
  //   };

  //   fetchImage();
  //   const interval = setInterval(fetchImage, 5000); // Poll every 5 seconds
  //   return () => clearInterval(interval);
  // }, []);

  // Poll for data periodically
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []); // Rerun when status changes

  return (
    <div className="relative flex flex-row min-h-screen">
      <Sidebar />
      <div className='absolute inset-0 z-10 w-screen h-full xl:p-32 xl:pr-48 xl:pl-96 md:p-18 md:pl-52 p-10 h-auto flex flex-row flex-wrap justify-evenly bg-gray-800'>
        {/* <img src={imageUrl} alt="Latest from Nicla Vision" /> */}
        <div className='status-cards-container'>
          {Object.entries(appliances).map(([name, appliance]) => {
            switch (name) {
              case "Oven":
                return (
                  <StatusCardOven
                    key={name}
                    appliance={name}
                    icon={appliance.icon}
                    status={appliance.status}
                    temperature={appliance.temperature}
                    onClick={() => handleCardClick(name)}
                  />
                );
              case "Door":
                return (
                  <DoorStatusCard
                    key={name}
                    appliance={name}
                    isOpen={appliance.isOpen}
                    lastOpened={appliance.lastOpened}
                    onClick={() => handleCardClick(name)}
                    status={appliance.status}
                  />
                );
              default:
                // Handle other appliances or return null if no specific component
                return null;
            }
          })}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            applianceInfo={selectedAppliance}
            url={selectedAppliance?.url}
          />
        </div>
      </div>
    </div>
  );
}

export default App;