import React, { useEffect, useState } from "react";

const SaleData = ({ fighterCharacteristicsIn, nftDataIn }) => {
    const [fighterCharacteristics, setFighterCharacteristics] = useState(fighterCharacteristicsIn || {});
    const [nftData, setNftData] = useState(nftDataIn || {});
    const [activeTab, setActiveTab] = useState('Overview');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    }

    const renderList = () => {
        if (activeTab === 'Overview') {
            return (
                <div className="flex justify-center items-center h-full flex-grow">
                    <div className="w-3/4 mt-2 h-full">
                        <div className="h-2/3 ">
                    
        
                            <div className="flex items-baseline text-gray-900 dark:text-white">
                                <span className="text-3xl font-semibold">$</span>
                                <span className="text-5xl font-extrabold tracking-tight">49</span>
                                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
                            </div>
                                <ul role="list" className="space-y-5 my-7">
                                    <li className="flex space-x-3 items-center">
                                        <svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">2 team members</span>
                                    </li>
                                    <li className="flex space-x-3">
                                        <svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">20GB Cloud storage</span>
                                    </li>
                                    <li className="flex space-x-3">
                                        <svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Integration help</span>
                                    </li>
                                    <li className="flex space-x-3 line-through decoration-gray-500">
                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500">Sketch Files</span>
                                    </li>
                                    <li className="flex space-x-3 line-through decoration-gray-500">
                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500">API Access</span>
                                    </li>
                                    <li className="flex space-x-3 line-through decoration-gray-500">
                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500">Complete documentation</span>
                                    </li>
                                    <li className="flex space-x-3 line-through decoration-gray-500">
                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="text-base font-normal leading-tight text-gray-500">24×7 phone & email support</span>
                                    </li>
                                </ul>
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === 'Properties') {
            return (
                <div className="flex justify-center items-center h-full flex-grow">
                    
                    <div className="w-3/4 mt-2 h-full">
                        <div className="h-2/3">
                            Yolo
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === 'Bids') {
            return (
                <div className="flex justify-center items-center h-full flex-grow">
                    <div className="w-3/4 mt-2 h-full">
                        <div className="h-2/3">
                            {/* Your Bids details here */}
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === 'Activity') {
            return (
                <div className="flex justify-center items-center h-full flex-grow">
                    <div className="w-3/4 mt-2 h-full">
                        <div className="h-2/3">
                            {/* Your Activity details here */}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex justify-center items-center h-full flex-grow">
                    <div className="w-3/4 mt-2 h-full">
                        <div className="h-2/3">
                            {/* Your else details here */}
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="flex justify-center items-center">
            <div className="w-3/4 mt-2 h-full">
                <div className="flex justify-between text-sm font-medium">
                    <div className="flex space-x-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex flex-col justify-center">
                        <span className="text-xs text-gray-400">Owned by</span>
                        <span className="font-medium">2304RC</span>
                    </div>
                    </div>
                    <div className="flex space-x-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex flex-col justify-center text-right">
                        <span className="text-xs text-gray-400">Created by</span>
                        <span className="font-medium">20AR02</span>
                    </div>
                    </div>
                </div>
                <ul className="flex flex-wrap text-sm font-medium text-center border-b border-gray-700 text-gray-400 h-1/10">
                    <li className="mr-2">
                        <a href="#" onClick={() => handleTabClick('Overview')} aria-current="page" className="inline-block p-4 rounded-t-lg active bg-gray-800 dark:text-blue-500">Overview</a>
                    </li>
                    <li className="mr-2">
                        <a href="#" onClick={() => handleTabClick('Properties')} className="inline-block p-4 rounded-t-lg   hover:bg-gray-800 hover:text-gray-300">Properties</a>
                    </li>
                    <li className="mr-2">
                        <a href="#" onClick={() => handleTabClick('Bids')} className="inline-block p-4 rounded-t-lg   hover:bg-gray-800 hover:text-gray-300">Bids</a>
                    </li>
                    <li className="mr-2">
                        <a href="#" onClick={() => handleTabClick('Activity')} className="inline-block p-4 rounded-t-lg  hover:bg-gray-800 hover:text-gray-300">Activitys</a>
                    </li>  
                </ul>
                <div className="overflow-y-auto max-h-4/5">
                    {renderList()}
                </div>
                <div className="w-9/10 h-1/2  p-2 border-4 rounded-3xl border-gray-400">
                    <div className="flex flex-row justify-between w-full ">
                        <div className="bg-zinc-600 shadow rounded-lg p-1 sm:p-3 xl:p-5 w-1/2 mr-1">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-m sm:text-l leading-none font-bold text-gray-900">Bid</span>
                                    <h3 className="text-s font-normal text-gray-500"></h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-600 shadow rounded-lg p-1 sm:p-3 xl:p-5 w-1/2 ml-1 ">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-m sm:text-l leading-none font-bold text-gray-900">Count</span>
                                    <h3 className="text-base font-normal text-gray-500"></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" className=" mt-1 text-white bg-blue-900 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Place Bid</button>
                </div>
            </div>
        </div>
        
    );
}
export default SaleData;
