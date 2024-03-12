import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';

function StatusCard(appliance, icon, timeForFirstAlarm, timeForKillswitch) {
    const Status = {
        OK: 'OK',
        Warning: 'Warning',
        Problem: 'Problem'
    };

    const [curState, setCurState] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);  // we need to receive the time from the raspberry
    const [message, setMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");

    useEffect(() => {
        if (curState === Status.OK) {
            setMessage(`The ${appliance} is off.`);
            setBackgroundColor("bg-lime-300 hover:bg-lime-200");
        } else if (curState === Status.Warning) {
            setMessage(`The ${appliance} has been on for:`);
            setBackgroundColor("bg-amber-300 hover:bg-amber-200");
        } else if (curState === Status.Problem) {
            setMessage(`The ${appliance} has been on for:`);
            setBackgroundColor("bg-orange-600 hover:bg-orange-500");
        } 
    }, [curState, appliance]);

    const applianceTurnedOn = () => {
        setCurState(Status.Warning);
    };

    const afterFirstAlarm = () => {
        setCurState(Status.Problem);
    }

    const turnOffAppliance = () => {
        setCurState(Status.OK);
    }

    useEffect(() => {
        turnOffAppliance();
    }, []);

  return (        
    <a href="#" className="w-1/2 justify-items-center px-3 py-7">
        <div class={"mx-auto block lg:max-w-lg md:max-w-md min-h-64 p-7 rounded-lg shadow " + backgroundColor}>
            <div className='flex flex-row py-6'>
                <h5 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{(curState == Status.Problem) ? "Problem Found" : "OK"}</h5>
                <FontAwesomeIcon icon="fa-solid fa-fire-burner" />
            </div>
            <p class="font-normal text-xl text-gray-700 dark:text-gray-400">{message}</p>
            {(curState == Status.OK) ? <p></p>: 
                <p>Time</p>
            }
        </div>
    </a>
  );
}

export default StatusCard;
