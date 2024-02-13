import { useState } from 'react';

const TimeSelector = ({ onTimeChange }) => {
  const [selectedTimes, setSelectedTimes] = useState([]);

  const toggleTimeSelection = (time) => {
    const updatedTimes = selectedTimes.includes(time)
      ? selectedTimes.filter(t => t !== time)
      : [...selectedTimes, time];
    setSelectedTimes(updatedTimes);
    onTimeChange(updatedTimes); // Notify the parent component
  };

  const timeButtons = [...Array(24).keys()].map(hour => {
    const time = `${hour}:00`;
    const isSelected = selectedTimes.includes(time);
    return (
      <button key={hour} onClick={() => toggleTimeSelection(time)} style={{ backgroundColor: isSelected ? 'green' : 'grey' }}>
        {time}
      </button>
    );
  });

  return <div>{timeButtons}</div>;
};

export default TimeSelector;