import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import StatusCard from './StatusCard';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { faFireBurner } from '@fortawesome/free-solid-svg-icons';

const RPi_IP = "172.20.10.14";
const RPi_port = "5000";
const RPi_URL = `http://${RPi_IP}:${RPi_port}`;

const NICLA_VISION_IP = "172.20.10.14";
const NICLA_VISION_PORT = "8000";
const NICLA_VISION_URL = `http://${NICLA_VISION_IP}:${NICLA_VISION_PORT}`;

const Status = {
  OK: 'OK',
  WARNING: 'Warning',
  PROBLEM: 'Problem'
};

function App() {
  const [temperature, setTemperature] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null); // Assuming you have multiple appliances
  const [status, setStatus] = useState('OK');
  const [alarmCount, setAlarmCount] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const handleCardClick = (appliance) => {
    setSelectedAppliance(appliance);
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    try {
      const tempResponse = await axios.get(RPi_URL + '/temperature');
      const alertResponse = await axios.get(RPi_URL + '/temp_alert_status');
      setTemperature(tempResponse.data.temperature);
      setAlarmCount(alertResponse.data.alert);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = NICLA_VISION_URL + '/latest-image';
      setImageUrl(`${imageUrl}?t=${new Date().getTime()}`); // Cache busting
    };

    fetchImage();
    const interval = setInterval(fetchImage, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatus = (count) => {
    if (count >= 2) return Status.PROBLEM;
    if (count === 1) return Status.WARNING;
    return Status.OK;
  };

  useEffect(() => {
    setStatus(getStatus(alarmCount));

  }, [alarmCount]);

  useEffect(() => {
    console.log("Fetching data. Status ", status);
    fetchData();
    const interval = setInterval(fetchData, 5000); // Adjust interval as needed
    return () => clearInterval(interval);
  });

  return (

    <div className="relative flex flex-row min-h-screen">
      <Sidebar></Sidebar>
      <div className='absolute inset-0 z-10 w-screen h-full xl:p-32 xl:pr-48 xl:pl-96 md:p-18 md:pl-52 p-10 h-auto flex flex-row flex-wrap justify-evenly bg-gray-800'>
        <img src={imageUrl} alt="Latest from Nicla Vision" />
        <StatusCard
          appliance="Oven"
          icon={faFireBurner}
          status={status}
          temperature={temperature}
          onClick={() => handleCardClick("Oven")}
        />
        <StatusCard
          appliance="Door"
          icon={faFireBurner}
          status={status}
          temperature={temperature}
          onClick={() => handleCardClick("Door")}

        />
        <StatusCard
          appliance="oven"
          icon={faFireBurner}
          status={status}
          temperature={temperature}
          onClick={() => handleCardClick("oven")}

        />
        <StatusCard
          appliance="oven"
          icon={faFireBurner}
          status={status}
          temperature={temperature}
          onClick={() => handleCardClick("oven")}

        />
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appliance={selectedAppliance}
          adjustTimerEndpoint={`${RPi_URL}/adjust_timer`}
          temperature={temperature}
          RPi_URL={RPi_URL}
          status={status}
        />
      </div>
    </div >
  );
}

export default App;
