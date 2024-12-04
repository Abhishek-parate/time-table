import React from 'react';

// ClockSelector component to select time slots
const ClockSelector = ({ times, onSelect }) => {
    return (
        <div className="grid grid-cols-4 gap-2">
            {times.map((time) => (
                <button 
                    key={time} 
                    onClick={() => onSelect(time)} 
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    {time}
                </button>
            ))}
        </div>
    );
};

export default ClockSelector;
