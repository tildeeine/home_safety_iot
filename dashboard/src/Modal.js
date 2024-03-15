import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Modal = ({ isOpen, onClose, appliance, temperature, icon, adjustTimerEndpoint, status, RPi_URL }) => {
    // Construct the dynamic class name based on the status
    const modalClassNames = `modal ${status === 'Warning' ? "bg-amber-300 text-gray-800" : "bg-lime-300 text-gray-800"} modal text-center p-5`;

    const [newTimerDuration, setNewTimerDuration] = useState('');
    const [currentAlertTime, setCurrentAlertTime] = useState('');

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
                    <div className={modalClassNames}>
                        <div className='modal-content text-lg'>
                            <h2 className="mb-6 mt-6 text-3xl font-bold">{appliance}</h2>
                            <p>Current Temperature: {temperature}°C</p>
                            <p className="mt-4">Current Alert Time: {currentAlertTime} minutes</p>
                            <form className="modal-form flex flex-col items-center" onSubmit={handleTimerAdjustment}>
                                <label htmlFor="timerDuration" className="mb-2">
                                    Set new alert time (minutes):
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
            )};
        </>
    );
};

export default Modal;