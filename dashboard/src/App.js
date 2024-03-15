import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import StatusCard from './StatusCard';
import Sidebar from './Sidebar';
import { faFireBurner } from '@fortawesome/free-solid-svg-icons';

const RPi_IP = "172.20.10.7";
const RPi_port = "5000";
const RPi_URL = `http://${RPi_IP}:${RPi_port}`;


function App() {
  const [temperature, setTemperature] = useState(0);
  const [alertStatus, setAlertStatus] = useState(false);

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
          appliance="oven"
          icon={faFireBurner}
          status={alertStatus ? 'Warning' : 'OK'}
          temperature={temperature}
        />
        <StatusCard
          appliance="oven"
          icon={faFireBurner}
          status={alertStatus ? 'Warning' : 'OK'}
          temperature={temperature}
        />
        <StatusCard
          appliance="oven"
          icon={faFireBurner}
          status={alertStatus ? 'Warning' : 'OK'}
          temperature={temperature}
        />
        <StatusCard
          appliance="oven"
          icon={faFireBurner}
          status={alertStatus ? 'Warning' : 'OK'}
          temperature={temperature}
        />
      </div>
    </div >
  );
}

export default App;
