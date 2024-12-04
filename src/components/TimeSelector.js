// TimeSelector.js
import React, { useState } from 'react';

const TimeSelector = ({ value, onChange, label }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const handleChange = () => {
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        onChange(timeString);
    };

    const handleHourChange = (e) => {
        setHours(Number(e.target.value));
        handleChange();
    };

    const handleMinuteChange = (e) => {
        setMinutes(Number(e.target.value));
        handleChange();
    };

    return (
        <div className="flex flex-col mb-4">
            <label className="font-bold">{label}</label>
            <div className="flex items-center">
                <select value={hours} onChange={handleHourChange} className="border rounded p-2">
                    {[...Array(24)].map((_, i) => (
                        <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                    ))}
                </select>
                <span className="mx-2">:</span>
                <select value={minutes} onChange={handleMinuteChange} className="border rounded p-2">
                    {[0, 15, 30, 45].map((minute) => (
                        <option key={minute} value={minute}>{String(minute).padStart(2, '0')}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default TimeSelector;
