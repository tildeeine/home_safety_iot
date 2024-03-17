import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';

function Sidebar() {
    const NICLA_VISION_IP = "172.20.10.3";
    const NICLA_VISION_PORT = "8080";
    const NICLA_VISION_URL = `http://${NICLA_VISION_IP}:${NICLA_VISION_PORT}/capture?timestamp=`;

    const [sideOpen, setSideOpen] = useState("noShow");
    const [showModal, setShowModal] = useState(false);
    const [camera, setCamera] = useState({ image: '', name: '' });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [timestamp, setTimestamp] = useState('');

    const cameras = [{ name: "Camera 1", id: 1 }, { name: "Camera 2", id: 2 }];

    const openCam = (cam) => {
        const newTimestamp = Date.now();
        setCamera({ ...cam, image: `${NICLA_VISION_URL}${newTimestamp}` });
        setTimestamp(new Date(newTimestamp).toLocaleString());
        setImageLoaded(false);
        setShowModal(true);
    };

    useEffect(() => {
        if (!showModal) return;

        const interval = setInterval(() => {
            const newTimestamp = Date.now();
            setCamera((prevCamera) => ({
                ...prevCamera,
                image: `${NICLA_VISION_URL}${newTimestamp}`
            }));
            setImageLoaded(false); // Assume image is not loaded when URL changes
        }, 5000); // Poll for new images every 5 seconds

        return () => clearInterval(interval);
    }, [showModal, NICLA_VISION_URL]);

    // Function to handle image load
    const handleImageLoad = () => {
        setImageLoaded(true);
        setTimestamp(new Date().toLocaleString()); // Update timestamp when the image actually loads
    };

    // Close modal if clicked outside
    const closeModal = (e) => {
        if (e.target.id === "modalBackdrop") {
            setShowModal(false);
        }
    };

    return (
        <>
            <div
                className={`${sideOpen} absolute h-full z-30 flex flex-grow flex-col overflow-y-auto overflow-hidden sm:border-r sm:border-gray-200 bg-gray-100 sm:bg-white pb-5 sm:px-0 pointer-events-auto`}
                onMouseEnter={() => setSideOpen("show")}
                onMouseLeave={() => setSideOpen("noShow")}
            >
                <div className="sm:mt-36 sm:mb-20">
                    <nav className="w-full flex-1 space-y-3 bg-white px-2" aria-label="Sidebar">
                        {cameras.map((cam) => (
                            <button
                                key={cam.id}
                                className="text-gray-600 hover:bg-gray-200 hover:text-redFep group flex w-full h-12 items-center rounded-md py-2 px-2 md:px-0 text-left text-xl sm:text-2xl font-medium bg-gray-100"
                                onClick={() => openCam(cam)}
                            >
                                <FontAwesomeIcon icon={faVideo} className={`mr-3 h-6 w-6 flex-shrink-0 bookPosition${sideOpen}`} aria-hidden="true" />
                                <div className={`sidebar-${sideOpen} transition-colors duration-200 mt-1 sm:mt-0`}>
                                    {cam.name}
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            {showModal && (
                <div id="modalBackdrop" onClick={closeModal} className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <div className="relative my-6 mx-auto max-w-3xl" style={{ width: '600px', height: '400px' }}>
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none" style={{ height: '100%' }}>
                            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                    Camera feed: Oven
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
                            <div className="relative p-6 flex-auto flex justify-center items-center" style={{ minHeight: '250px' }}>
                                <div className={`text-center ${imageLoaded ? 'hidden' : 'block'}`}>
                                    <p className="text-gray-600 text-lg">Getting image...</p>
                                </div>
                                <img
                                    src={camera.image}
                                    alt="Camera Feed"
                                    className={`max-w-full max-h-full ${!imageLoaded ? 'hidden' : 'block'}`}
                                    onLoad={handleImageLoad}
                                    style={{ display: imageLoaded ? 'block' : 'none' }} // Use CSS to control visibility
                                />
                            </div>
                            {imageLoaded ? (
                                <div className="flex justify-center p-6 border-t border-solid border-gray-300 rounded-b">
                                    <p className="text-gray-600 text-lg">
                                        Image taken at {timestamp}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex justify-center p-6 border-t border-solid border-gray-300 rounded-b">
                                    <p className="text-gray-600 text-lg">
                                        No image taken.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default Sidebar;