import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Status = {
    OK: 'OK',
    WARNING: 'Warning',
    PROBLEM: 'Problem'
};
const backgroundColorClasses = {
    [Status.OK]: "bg-lime-300 hover:bg-lime-200 text-gray-800",
    [Status.WARNING]: "bg-amber-300 hover:bg-amber-200 text-gray-800",
    [Status.PROBLEM]: "bg-orange-600 hover:bg-orange-500 text-gray-100",
};

function StatusCard({ appliance, icon, status, temperature, onClick }) {
    const statusMessage = {
        [Status.OK]: `The ${appliance} is off.`,
        [Status.WARNING]: `Warning: The ${appliance}'s temperature is high!`,
        [Status.PROBLEM]: `Problem: The ${appliance} needs immediate attention!`,
    };

    return (
        <button className="link-like-button w-1/2 justify-items-center px-3 py-7" onClick={onClick}>
            <div className={`mx-auto block lg:max-w-xl md:max-w-md md:min-h-72 min-h-64 p-7 rounded-lg shadow ${backgroundColorClasses[status]}`}>
                <div className='flex flex-row py-6 justify-between'>
                    <h5 className="mb-2 md:text-5xl sm:text-4xl text-2xl font-bold tracking-tight text-gray-800">{status}</h5>
                    <FontAwesomeIcon icon={icon} className="text-5xl p-2" />
                </div>
                <p className="font-normal md:text-xl text-md pt-4">{statusMessage[status]}</p>
                <p className="font-normal md:text-xl text-md pt-4">Current Temperature: {temperature}°C</p>
            </div>
        </button>
    );
}

export default StatusCard;
