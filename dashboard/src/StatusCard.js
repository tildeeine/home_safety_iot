import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


function StatusCard({ appliance, icon, status, temperature, onClick }) {
    const backgroundColor = status === 'Warning' ? "bg-amber-300 hover:bg-amber-200 text-gray-800" : "bg-lime-300 hover:bg-lime-200 text-gray-800";
    const statusMessage = status === 'Warning' ? `Warning: The ${appliance}'s temperature is high!` : `The ${appliance} is off.`;


    // const [curState, setCurState] = useState(0);
    // const [message, setMessage] = useState("");
    // const [backgroundColor, setBackgroundColor] = useState("");

    // useEffect(() => {
    //     if (curState === Status.OK) {
    //         setMessage(`The ${appliance} is off.`);
    //         setBackgroundColor("bg-lime-300 hover:bg-lime-200 text-gray-800");
    //     } else if (curState === Status.Warning) {
    //         setMessage(`The ${appliance} has been on for:`);
    //         setBackgroundColor("bg-amber-300 hover:bg-amber-200 text-gray-800");
    //     } else if (curState === Status.Problem) {
    //         setMessage(`The ${appliance} has been on for:`);
    //         setBackgroundColor("bg-orange-600 hover:bg-orange-500 text-gray-100");
    //     }
    // }, [curState, appliance]);

    // const applianceTurnedOn = () => {
    //     setCurState(Status.Warning);
    // };

    // const afterFirstAlarm = () => {
    //     setCurState(Status.Problem);
    // }

    // const turnOffAppliance = () => {
    //     setCurState(Status.OK);
    // }

    // useEffect(() => {
    //     turnOffAppliance();
    // }, []);

    return (
        <button className="link-like-button w-1/2 justify-items-center px-3 py-7" onClick={onClick}>
            <div className={`mx-auto block lg:max-w-xl md:max-w-md md:min-h-72 min-h-64 p-7 rounded-lg shadow ${backgroundColor}`}>
                <div className='flex flex-row py-6 justify-between'>
                    <h5 className="mb-2 md:text-5xl sm:text-4xl text-2xl font-bold tracking-tight text-gray-800">{status}</h5>
                    <FontAwesomeIcon icon={icon} className="text-5xl p-2" />
                </div>
                <p className="font-normal md:text-xl text-md pt-4">{statusMessage}</p>
                <p className="font-normal md:text-xl text-md pt-4">Current Temperature: {temperature}°C</p>
            </div>
        </button>
    );
}

export default StatusCard;

