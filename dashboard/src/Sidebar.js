import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';

function Sidebar() {

    const [sideOpen, setSideOpen] = useState("noShow");
    const [showModal, setShowModal] = useState(false);
    const [camera, setCamera] = useState({});

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
        setCamera(cam);
        setShowModal(true);
    }

    return (
    <>
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
                            onClick={() => {openCam(cam)}}
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
        {showModal ? (
            <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                    {camera.name}
                                </h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                >
                                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        ×
                                    </span>
                                </button>
                            </div>
                            <div className="relative p-6 flex-auto">
                                <img src={camera.image} alt="camera" className="w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-30 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null}
    </>
  );
}

export default Sidebar;
