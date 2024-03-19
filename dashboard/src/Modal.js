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
    applianceInfo,
    status,
    mainData,
    url
}) => {

    const [newTimerDuration, setNewTimerDuration] = useState('');
    const [currentAlertTime, setCurrentAlertTime] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch current alert time when the modal opens
    // TODO manually check for updates and set to re-render
    useEffect(() => {
        if (isOpen) {
            const fetchAlertTime = async () => {
                try {
                    const response = await axios.get(`${url}/alert_time`);
                    setCurrentAlertTime(response.data.duration);
                    setNewTimerDuration(response.data.duration);
                } catch (error) {
                    console.error('Failed to fetch alert time:', error);
                }
            };
            fetchAlertTime();
        }
    }, [isOpen, url, applianceInfo]);

    // Handle timer adjustment form submission
    const handleTimerAdjustment = async (event) => {
        event.preventDefault();
        try {
            const durationInSeconds = parseInt(newTimerDuration, 10) * 60;
            await axios.post(`${url}/alert_time`, { duration: durationInSeconds });

            setUpdateSuccess(true);
            setErrorMessage('');
            setTimeout(() => {
                setUpdateSuccess(null);
            }, 3000);
        } catch (error) {
            console.error('Failed to adjust timer:', error);
            setUpdateSuccess(false);
            setErrorMessage('Failed to adjust timer. Please try again.');
            setTimeout(() => {
                setErrorMessage('');
                setUpdateSuccess(null);
            }, 3000);
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
                        <p>Current Temperature: {mainData}°C</p>
                        <p className="mt-4">Current Alert Time: {currentAlertTime} minutes</p>
                        <form className="modal-form flex flex-col items-center" onSubmit={handleTimerAdjustment}>
                            <label htmlFor="timerDuration" className="mb-2">Set New Alert Time (minutes):</label>
                            <input
                                id="timerDuration"
                                type="number"
                                value={newTimerDuration}
                                className="mt-4 mb-4 p-2 w-1/5 border-2 border-gray-200 rounded"
                                onChange={(e) => setNewTimerDuration(e.target.value)}
                                required
                            />
                            <button type="submit" className="mt-4 p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">Update Timer</button>
                            {updateSuccess && (
                                <p className="text-green-500">Alert timer updated successfully!</p>
                            )}
                            {updateSuccess === false && errorMessage && (
                                <p className="text-red-500">{errorMessage}</p>
                            )}
                        </form>
                    </>
                );
            case 'Door':
                return (
                    <>
                        <h2 className="mb-6 mt-6 text-3xl font-bold">{applianceInfo.type}</h2>
                        <p>Status: {status === Status.OK ? 'Closed' : 'Open'}</p>
                        {status === Status.OK && (
                            <p>Closed at: {mainData}</p>
                        )}
                        {status !== Status.OK && (
                            <p>Opened at: {mainData}</p>
                        )}
                        <form className="modal-form flex flex-col items-center" onSubmit={handleTimerAdjustment}>
                            <label htmlFor="timerDuration" className="mb-2">Set New Alert Time (minutes):</label>
                            <input
                                id="timerDuration"
                                type="number"
                                value={newTimerDuration}
                                className="mt-4 mb-4 p-2 w-1/5 border-2 border-gray-200 rounded"
                                onChange={(e) => setNewTimerDuration(e.target.value)}
                                required
                            />
                            <button type="submit" className="mt-4 p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">Update Timer</button>
                            {updateSuccess && (
                                <p className="text-green-500">Alert timer updated successfully!</p>
                            )}
                            {updateSuccess === false && errorMessage && (
                                <p className="text-red-500">{errorMessage}</p>
                            )}
                        </form>
                    </>
                );
            default:
                console.log(backgroundColorClasses[status]);
                return <p className="mt-10 text-3xl font-bold">Appliance info not available</p>;
        }
    };

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className={`modal ${backgroundColorClasses[status]} text-center`}>
                <div className="modal-content text-lg">
                    {renderModalContent()}
                </div>
            </div>
        </>
    );
};
export default Modal;
