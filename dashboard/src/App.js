import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import StatusCardOven from './StatusCardOven';
import DoorStatusCard from './StatusCardDoor';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { faFireBurner } from '@fortawesome/free-solid-svg-icons';
import data from './network_info.json';


// Constants for API URLs
const NETWORK_ID = 1;
const RPI_OVEN_IP = data[NETWORK_ID].OvenRPiIP;
const RPI_OVEN_PORT = "5000";
const RPI_OVEN_URL = `http://${RPI_OVEN_IP}:${RPI_OVEN_PORT}`;

const RPI_DOOR_IP = data[NETWORK_ID].DoorRPiIP;
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
    Oven: { temperature: 0, status: Status.OK, icon: faFireBurner, type: 'Oven', url: RPI_OVEN_URL },
    Door: { last_changed: 'Not available', isOpen: false, status: Status.OK, type: 'Door', url: RPI_DOOR_URL },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState('Oven');

  // Handle card click events
  const handleCardClick = (appliance) => {
    const selectedApplianceInfo = appliances[appliance];
    setSelectedAppliance(selectedApplianceInfo);
    setIsModalOpen(true);
  };

  // Fetch data from server and update the relevant appliances
  const fetchData = async () => {
    try {
      const responses = await Promise.all([ // Promise all because we set data based on these results, can't access null
        axios.get(`${RPI_OVEN_URL}/temperature`),
        axios.get(`${RPI_OVEN_URL}/alert_status`),
        axios.get(`${RPI_DOOR_URL}/alert_status`),
        axios.get(`${RPI_DOOR_URL}/door_last_changed`),
      ]);
      const tempResponse = responses[0];
      const ovenAlert = responses[1];
      const doorAlert = responses[2];
      const doorLastChanged = responses[3];

      const determineStatus = (count) => {
        if (count >= 2) return Status.PROBLEM;
        if (count === 1) return Status.WARNING;
        return Status.OK;
      };

      const checkIsOpen = (count) => {
        if (count > 0) return true;
        return false;
      };

      // Update appliances based on fetched data
      setAppliances(prevAppliances => ({
        ...prevAppliances,
        Oven: {
          ...prevAppliances.Oven,
          temperature: tempResponse.data.temperature,
          status: determineStatus(ovenAlert.data.alert),
        },
        Door: {
          ...prevAppliances.Door,
          isOpen: checkIsOpen(doorAlert.data.alert),
          doorLastChanged: doorLastChanged.data.last_changed,
          status: determineStatus(doorAlert.data.alert),
        }
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Poll for data periodically
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-row min-h-screen">
      <Sidebar />
      <div className='absolute inset-0 z-10 w-screen h-full xl:p-32 xl:pr-48 xl:pl-96 md:p-18 md:pl-52 p-10 h-auto flex flex-row flex-wrap justify-evenly bg-gray-800'>
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
                    lastChanged={appliance.last_changed}
                    onClick={() => handleCardClick(name)}
                    status={appliance.status}
                  />
                );
              default:
                return null;
            }
          })}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            applianceInfo={selectedAppliance}
            status={selectedAppliance?.status}
            mainData={selectedAppliance?.type === 'Oven' ? selectedAppliance.temperature : selectedAppliance.doorLastChanged}
            url={selectedAppliance?.url}
          />
        </div>
      </div>
    </div>
  );
}

export default App;