import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import StatusCardOven from './StatusCardOven';
import DoorStatusCard from './StatusCardDoor';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { faFireBurner, faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons';


// Constants for API URLs
const RPI_IP = "172.20.10.14";
const RPI_PORT = "5000";
const RPI_URL = `http://${RPI_IP}:${RPI_PORT}`;

const NICLA_VISION_IP = "172.20.10.14";
const NICLA_VISION_PORT = "8000";
const NICLA_VISION_URL = `http://${NICLA_VISION_IP}:${NICLA_VISION_PORT}`;

const Status = {
  OK: 'OK',
  WARNING: 'Warning',
  PROBLEM: 'Problem'
};

const alarmCount = 0;

function App() {
  // State hooks
  const [appliances, setAppliances] = useState({
    Oven: { temperature: 0, status: Status.OK, icon: faFireBurner },
    Door: { isOpen: false, lastOpened: 'Not available', status: Status.OK, icon: faFireBurner }, // Example of other appliance
    // Add other appliances as needed
  });
  const [doorStatus, setDoorStatus] = useState({
    isOpen: false,
    lastOpened: 'Not available'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [status, setStatus] = useState(Status.OK);
  const [imageUrl, setImageUrl] = useState('');

  // Handle card click events
  const handleCardClick = (appliance) => {
    setSelectedAppliance(appliance);
    setIsModalOpen(true);
  };

  // Fetch data from server and update the relevant appliances
  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        axios.get(`${RPI_URL}/temperature`),
        axios.get(`${RPI_URL}/temp_alert_status`),
        axios.get(`${RPI_URL}/door_open_status`),
        axios.get(`${RPI_URL}/door_last_opened`),
        axios.get(`${RPI_URL}/door_alert_Status`),
        // Add other endpoints as needed for different appliances
      ]);
      const tempResponse = responses[0];
      const ovenAlert = responses[1];
      const doorOpenStatus = responses[2];
      const lastOpened = responses[3];
      const doorAlert = responses[4];

      // Update only inputs and status'
      setAppliances(prevAppliances => ({
        ...prevAppliances,
        Oven: { ...prevAppliances.Oven, temperature: tempResponse, status: ovenAlert },
        Door: { ...prevAppliances.Door, isOpen: doorOpenStatus, lastOpened: lastOpened, status: doorAlert },
        // Update other appliances similarly
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch the latest image from camera
  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = `${NICLA_VISION_URL}/latest-image`;
      setImageUrl(`${imageUrl}?t=${new Date().getTime()}`); // Cache busting
    };

    fetchImage();
    const interval = setInterval(fetchImage, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Update status based on alarm count
  useEffect(() => {
    const determineStatus = (count) => {
      if (count >= 2) return Status.PROBLEM;
      if (count === 1) return Status.WARNING;
      return Status.OK;
    };

    setStatus(determineStatus(alarmCount));
  }, []);

  // Poll for data periodically
  useEffect(() => {
    console.log("Fetching data. Status:", status);
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [status]); // Rerun when status changes

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
            appliance={selectedAppliance}
            adjustTimerEndpoint={`${RPI_URL}/alert_time`}
            temperature={appliances[selectedAppliance]?.temperature}
            RPI_URL={RPI_URL}
            status={appliances[selectedAppliance]?.status}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
