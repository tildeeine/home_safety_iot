import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import StatusCard from './StatusCard';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { faFireBurner } from '@fortawesome/free-solid-svg-icons';

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

function App() {
  // State hooks
  const [temperature, setTemperature] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [status, setStatus] = useState(Status.OK);
  const [alarmCount, setAlarmCount] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  // Handle card click events
  const handleCardClick = (appliance) => {
    setSelectedAppliance(appliance);
    setIsModalOpen(true);
  };

  // Fetch temperature and alarm count from the server
  const fetchData = async () => {
    try {
      const tempResponse = await axios.get(RPI_URL + '/temperature');
      const alertResponse = await axios.get(RPI_URL + '/temp_alert_status');
      setTemperature(tempResponse.data.temperature);
      setAlarmCount(alertResponse.data.alert);
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
  }, [alarmCount]);


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
          adjustTimerEndpoint={`${RPI_URL}/alert_time`}
          temperature={temperature}
          RPI_URL={RPI_URL}
          status={status}
        />
      </div>
    </div >
  );
}

export default App;
