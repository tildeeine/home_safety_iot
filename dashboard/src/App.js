import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import StatusCard from './StatusCard';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { faFireBurner } from '@fortawesome/free-solid-svg-icons';

const RPi_IP = "172.20.10.7";
const RPi_port = "5000";
const RPi_URL = `http://${RPi_IP}:${RPi_port}`;


function App() {
  const [temperature, setTemperature] = useState(0);
  const [alertStatus, setAlertStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null); // Assuming you have multiple appliances
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleCardClick = (appliance, status) => {
    setSelectedAppliance(appliance);
    setSelectedStatus(status); // Assuming you add this state to hold the status or color.
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    try {
      const tempResponse = await axios.get(RPi_URL + '/temperature');
      const alertResponse = await axios.get(RPi_URL + '/temp_alert_status');
      setTemperature(tempResponse.data.temperature);
      setAlertStatus(alertResponse.data.alert);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Adjust interval as needed
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-row min-h-screen">
      <Sidebar></Sidebar>
      <div className='absolute inset-0 z-10 w-screen h-full xl:p-32 xl:pr-48 xl:pl-96 md:p-18 md:pl-52 p-10 h-auto flex flex-row flex-wrap justify-evenly bg-gray-800'>
        <StatusCard
          appliance="Oven"
          icon={faFireBurner}
          status={alertStatus ? 'Warning' : 'OK'}
          temperature={temperature}
          onClick={() => handleCardClick("Oven")}
        />
        <StatusCard
          appliance="oven"
          icon={faFireBurner}
          status={alertStatus ? 'Warning' : 'OK'}
          temperature={temperature}
          onClick={() => handleCardClick("oven")}
        />
        <StatusCard
          appliance="oven"
          icon={faFireBurner}
          status={alertStatus ? 'Warning' : 'OK'}
          temperature={temperature}
          onClick={() => handleCardClick("oven")}
        />
        <StatusCard
          appliance="oven"
          icon={faFireBurner}
          status={alertStatus ? 'Warning' : 'OK'}
          temperature={temperature}
          onClick={() => handleCardClick("oven")}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appliance={selectedAppliance}
          adjustTimerEndpoint={`${RPi_URL}/adjust_timer`}
          temperature={temperature}
          status={selectedStatus}
          RPi_URL={RPi_URL}
        />
      </div>
    </div >
  );
}

export default App;
