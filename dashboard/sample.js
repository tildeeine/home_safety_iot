// Sample Dashboard Component for backend interaction
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [heatData, setHeatData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('RPI_URL/api/heat', { /* Additional data if needed */ });
                setHeatData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Heat Sensor Data: {heatData}</h1>
            {/* Render other sensor data as needed */}
        </div>
    );
};

export default Dashboard;
