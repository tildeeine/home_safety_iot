import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

function Sidebar() {

    const [sideOpen, setSideOpen] = useState("noShow");

    const cameras = [
        {
            name: "Camera 1",
            id: 1
        },
        {
            name: "Camera 2",
            id: 2
        }
    ]

    const openCam = (cam) => {
        console.log(cam.name);
    }

    return (
        <div
            className={sideOpen + " absolute h-full z-30 flex flex-grow flex-col overflow-y-auto overflow-hidden sm:border-r sm:border-gray-200 bg-gray-100 sm:bg-white pb-5 sm:px-0 pointer-events-auto"}
            onMouseEnter={() => setSideOpen("show")}
            onMouseLeave={() => setSideOpen("noShow")}
        >
            <div className="sm:mt-36 sm:mb-20">
                <nav className="w-full flex-1 space-y-3 bg-white px-2" aria-label="Sidebar">
                    {cameras.map((cam) =>
                        <button
                            as="button"
                            className={'text-gray-600 hover:bg-gray-200 hover:text-redFep group flex w-full h-12 items-center rounded-md py-2 px-2 md:px-0 text-left text-xl sm:text-2xl font-medium bg-gray-100'}
                            onClick={() => { openCam(cam) }}
                        >
                            <FontAwesomeIcon icon={faVideo} className={'mr-3 h-6 w-6 flex-shrink-0 bookPosition' + sideOpen} aria-hidden="true" />
                            <div className={'sidebar-' + sideOpen + ' transition-colors duration-200 mt-1 sm:mt-0'}>
                                {cam.name}
                            </div>
                        </button>
                    )}
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;
