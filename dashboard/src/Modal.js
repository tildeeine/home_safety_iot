import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Status constants
const Status = {
    OK: 'OK',
    WARNING: 'Warning',
    PROBLEM: 'Problem'
};

// Background color classes based on status
const backgroundColorClasses = {
    [Status.OK]: "bg-lime-300 text-gray-800",
    [Status.WARNING]: "bg-amber-300 text-gray-800",
    [Status.PROBLEM]: "bg-orange-600 text-gray-100",
};

const Modal = ({
    isOpen,
    onClose,
    applianceInfo, // Changed to a more generic prop to handle different appliance info
    RPi_URL,
}) => {

    const [newTimerDuration, setNewTimerDuration] = useState('');
    const [currentAlertTime, setCurrentAlertTime] = useState('');

    // Fetch current alert time when the modal opens
    useEffect(() => {
        if (isOpen && applianceInfo.type === 'Oven') {
            // Fetch current alert time only for the Oven
            const fetchAlertTime = async () => {
                try {
                    const response = await axios.get(`${RPi_URL}/alert_time`);
                    setCurrentAlertTime(response.data.duration);
                    setNewTimerDuration(response.data.duration); // Prefill the form with the current alert time for the oven
                } catch (error) {
                    console.error('Failed to fetch alert time:', error);
                }
            };
            fetchAlertTime();
        }
    }, [isOpen, RPi_URL, applianceInfo]);

    // Handle timer adjustment form submission
    const handleTimerAdjustment = async (event) => {
        event.preventDefault();
        if (applianceInfo.type === 'Oven') {
            try {
                // Convert minutes to seconds for the backend, only for the Oven
                const durationInSeconds = parseInt(newTimerDuration, 10) * 60;
                await axios.post(`${RPi_URL}/adjust_timer`, { duration: durationInSeconds });
                onClose(); // Close the modal upon successful submission
            } catch (error) {
                console.error('Failed to adjust timer:', error);
            }
        }
    };

    // Early return if modal is not open
    if (!isOpen) return null;

    // Determine content based on appliance type
    const renderModalContent = () => {
        switch (applianceInfo.type) {
            case 'Oven':
                return (
                    <>
                        <h2 className="mb-6 mt-6 text-3xl font-bold">{applianceInfo.type}</h2>
                        <p>Current Temperature: {applianceInfo.temperature}°C</p>
                        <p className="mt-4">Current Alert Time: {currentAlertTime} minutes</p>
                        <form className="modal-form flex flex-col items-center" onSubmit={handleTimerAdjustment}>
                            <label htmlFor="timerDuration" className="mb-2">Set New Alert Time (minutes):</label>
                            <input
                                id="timerDuration"
                                type="number"
                                value={newTimerDuration}
                                className="mt-4 mb-4 p-2 w-3/4 border-2 border-gray-200 rounded"
                                onChange={(e) => setNewTimerDuration(e.target.value)}
                                required
                            />
                            <button type="submit" className="mt-4 p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">Update Timer</button>
                        </form>
                    </>
                );
            case 'Door':
                // Customize content for the Door or other appliances
                return (
                    <>
                        <h2 className="mb-6 mt-6 text-3xl font-bold">{applianceInfo.type}</h2>
                        <p>Status: {applianceInfo.isOpen ? 'Open' : 'Closed'}</p>
                        <p>Last Opened: {applianceInfo.lastOpened}</p>
                    </>
                );
            default:
                console.log(backgroundColorClasses[applianceInfo.status]);
                return <p className="mt-10 text-3xl font-bold">Appliance info not available</p>;
        }
    };

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className={`modal ${backgroundColorClasses[applianceInfo.status]} text-center`}>
                <div className="modal-content text-lg">
                    {renderModalContent()}
                </div>
            </div>
        </>
    );
};
export default Modal;
