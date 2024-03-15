import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Status = {
    OK: 'OK',
    WARNING: 'Warning',
    PROBLEM: 'Problem'
};

const Modal = ({ isOpen, onClose, appliance, adjustTimerEndpoint, temperature, RPi_URL, status }) => {

    const backgroundColorClasses = {
        [Status.OK]: "bg-lime-300 hover:bg-lime-200 text-gray-800",
        [Status.WARNING]: "bg-amber-300 hover:bg-amber-200 text-gray-800",
        [Status.PROBLEM]: "bg-orange-600 hover:bg-orange-500 text-gray-100",
    };

    const [newTimerDuration, setNewTimerDuration] = useState('');
    const [currentAlertTime, setCurrentAlertTime] = useState('');

    console.log("dict result", backgroundColorClasses[status]);

    useEffect(() => {
        if (isOpen) {
            // Fetch current alert time when the modal opens
            const fetchAlertTime = async () => {
                try {
                    const response = await axios.get(`${RPi_URL}/alert_time`);
                    setCurrentAlertTime(response.data.duration);
                    setNewTimerDuration(response.data.duration);  // Optionally prefill the form with the current alert time
                } catch (error) {
                    console.error('Failed to fetch alert time:', error);
                }
            };
            fetchAlertTime();
        }
    }, [isOpen, RPi_URL]);

    const handleTimerAdjustment = async (e) => {
        e.preventDefault();
        try {
            // Assuming backend expects seconds, convert minutes to seconds
            const durationInSeconds = parseInt(newTimerDuration, 10) * 60;
            await axios.post(adjustTimerEndpoint, { duration: durationInSeconds });
            onClose(); // Close the modal upon successful submission
        } catch (error) {
            console.error('Failed to adjust timer:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {isOpen && (
                <>
                    <div className="overlay" onClick={onClose}></div>
                    <div className={`modal ${backgroundColorClasses[status]} text-center`}>
                        <div className={`modal-content text-lg`}>
                            <h2 className="mb-6 mt-6 text-3xl font-bold">{appliance}</h2>
                            <p>Current Temperature: {temperature}°C</p>
                            <p className="mt-4">Current Alert Time: {currentAlertTime} minutes</p>
                            <form className="modal-form flex flex-col items-center" onSubmit={handleTimerAdjustment}>
                                <label htmlFor="timerDuration" className="mb-2">
                                    Set New Alert Time (minutes):
                                </label>
                                <input
                                    id="timerDuration"
                                    type="number"
                                    value={newTimerDuration}
                                    className="mt-4 mb-4 p-2 w-3/4 border-2 border-gray-200 rounded"
                                    onChange={(e) => setNewTimerDuration(e.target.value)}
                                    required
                                />
                                <button type="submit" className="mt-4 p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">Update timer</button>
                            </form>
                        </div>
                    </div>
                </>
            )
            };
        </>
    );
};

export default Modal;
