// Importing necessary hooks from React
import { useEffect, useRef } from 'react';
// Importing Chart library and its required elements
import { Chart, registerables } from 'chart.js';

// Registering required elements to Chart
Chart.register(...registerables);

const FighterSpecs = () => {    
    // Using useRef to reference the canvas element
    const canvasRef = useRef(null);
    // Using useRef to keep a reference to the chart instance
    const chartRef = useRef(null); // A note about possibly removing one of the refs

    // useEffect hook to handle chart creation and cleanup
    useEffect(() => {
        // Check if a chart exists, if so, destroy it to avoid memory leaks
        if (chartRef.current) {  
            chartRef.current.destroy();
            chartRef.current = null; // Resetting the reference
        }
        // Check if the canvas element is available
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            // Create a new radar chart on the canvas
            chartRef.current = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    datasets: [{
                        label: 'Traffic',
                        data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {}
            });
        }
        
        // Cleanup function to destroy the chart on unmounting
        return () => {
            if (chartRef.current) { 
                chartRef.current.destroy();
                chartRef.current = null; 
            }
        };
    }, []);

    // Component's render
    return (
        <>
            <div className="ml-1">
                <div className="flex justify-between text-sm font-medium">
                    {/* Owner details */}
                    <div className="flex space-x-2">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex flex-col justify-center">
                            <span className="text-xs text-gray-400">Owned by</span>
                            <span className="font-medium">2304RC</span>
                        </div>
                    </div>
                    {/* Creator details */}
                    <div className="flex space-x-2">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex flex-col justify-center text-right">
                            <span className="text-xs text-gray-400">Created by</span>
                            <span className="font-medium">20AR02</span>
                        </div>
                    </div>
                </div>
                {/* Canvas for the radar chart */}
                <canvas ref={canvasRef} />
                {/* Bid section */}
                <div className="w-9/10  p-2 border-4 rounded-3xl border-gray-400 mt-4">
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
                    {/* Place Bid button */}
                    <button type="button" className=" mt-1 text-white bg-blue-900 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Place Bid</button>
                </div>
            </div>
        </>
    );
}

// Exporting the FighterSpecs component
export default FighterSpecs;
