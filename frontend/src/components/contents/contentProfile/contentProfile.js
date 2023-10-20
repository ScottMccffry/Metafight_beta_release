import React, { useState, useContext } from 'react';
import axios from 'axios';
import UnifiedContext from '../../../context/UnifiedContext';
import FightModal from '../../fightModal/fightModal';
import WidgetTableProfile from '../../widgetTableProfile/widgetTableProfile.js';


function ContentProfile({userData}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isConnected } = useContext(UnifiedContext);

  const handleButtonClick = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
   
<div class="p-8 bg-zinc-800 shadow mt-20 mr-5">
  <div class="grid grid-cols-1 md:grid-cols-3">
    <div class="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
      <div>
        <p class="font-bold text-gray-300 text-xl">22</p>
        <p class="text-gray-400">Friends</p>
      </div>
      <div>
           <p class="font-bold text-gray-300 text-xl">10</p>
        <p class="text-gray-400">Fighters</p>
      </div>
          <div>
           <p class="font-bold text-gray-300 text-xl">89</p>
        <p class="text-gray-400">Fights</p>
      </div>
    </div>
    <div class="relative">
      <div class="w-48 h-48 bg-fuchsia-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-fuchsia-500">
<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
</svg>
      </div>
    </div>

    <div class="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
<button
  class="text-white py-2 px-4 uppercase rounded bg-fuchsia-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
>
  Connect
</button>
    <button
  class="text-white py-2 px-4 uppercase rounded bg-gray-300 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
>
  Message
</button>
    </div>
  </div>

  <div class="mt-20 text-center border-b pb-12">
    <h1 class="text-4xl font-medium text-gray-300">Jessica Jones, <span class="font-light text-gray-500">27</span></h1>
    <p class="font-light text-gray-600 mt-3">Bucharest, Romania</p>

    <div >
        <WidgetTableProfile />
    </div>
  </div>

 


  {/*
   <div class="mt-12 flex flex-col justify-center">
    <p class="text-gray-600 text-center font-light lg:px-16">An artist of considerable range, Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.</p>
    <button
  class="text-fuchsia-500 py-2 px-4  font-medium mt-4"
>
  Show more
</button>
  </div>
    <div className="grid grid-cols-2 gap-4 items-center mt-4"> 
    <div className="flex justify-center">
      <div className="w-full max-w-sma rounded-lg shadow dark:bg-gray-800 dark:border-gray-300">
        <div className="flex justify-end px-4 pt-4">
        <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-300 rounded-lg text-sm p-1.5" type="button">
            <span className="sr-only">Open dropdown</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
        </button>
        <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-300">
            <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
            </li>
            <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
            </li>
            <li>
                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
            </li>
            </ul>
        </div>
    </div>
    <div className="flex flex-col items-center pb-10">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={userData?.image} alt="User image"/>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{userData?.username}</h5>
           
        <div className="flex mt-4 space-x-3 md:mt-6">
            <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add friend</a>
            <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-300 dark:hover:border-gray-300 dark:focus:ring-gray-300">Message</a>
        </div>
    </div>
</div>


      </div>
      
        <div className="mr-5">
        <WidgetTableProfile />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between px-3 mt-3">
        <h2 className="text-xl font-semibold">Their Fighters</h2>
        
        </div>
    
    </div>
    */}
</div>
  
    
  );
}

export default ContentProfile;
