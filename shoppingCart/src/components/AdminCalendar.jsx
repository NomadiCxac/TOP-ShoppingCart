import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import 'react-datepicker/dist/react-datepicker.css';
import './AdminCalendar.css'

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timesForSelectedDate, setTimesForSelectedDate] = useState([]);
  const { getPickupTimesForDate, updatePickupTimesForDate } = useFirebaseOrders();

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        console.log('Fetching times for:', selectedDate);
        const fetchedTimes = await getPickupTimesForDate(selectedDate);
        console.log('Fetched times:', fetchedTimes);
        setTimesForSelectedDate(fetchedTimes || []);
      } catch (error) {
        console.error('Failed to fetch times:', error);
      }
    };
    fetchTimes();
  }, [selectedDate]);

  const toggleTimeSelection = (time) => {
    console.log('Toggling time:', time);
    setTimesForSelectedDate(currentTimes => {
      const updatedTimes = currentTimes.includes(time)
        ? currentTimes.filter(t => t !== time)
        : [...currentTimes, time];
      console.log('Updated times:', updatedTimes);
      return updatedTimes;
    });
  };

  const saveTimes = async () => {
    console.log('Saving times:', timesForSelectedDate);
    try {
      await updatePickupTimesForDate(selectedDate, timesForSelectedDate);
      alert('Times saved successfully.');
    } catch (error) {
      console.error('Failed to save times:', error);
    }
  };

  return (
    <div className='adminCalendarContainer'>
      <h2>Select a Valid Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          console.log('Date selected:', date);
          setSelectedDate(date);
        }}
        filterDate={date => date >= new Date().setHours(0, 0, 0, 0)}
        inline
      />
      <h3>Select Available Times</h3>
      <div className="timeSlotPickerContainer">
        {[...Array(24).keys()].map(hour => {
          const time = `${hour}:00`;
          return (
            <button
              key={hour}
              onClick={() => toggleTimeSelection(time)}
              style={{ backgroundColor: timesForSelectedDate.includes(time) ? 'green' : 'lightgrey', margin: '4px' }}
            >
              {time}
            </button>
          );
        })}
      </div>
      <button className='saveTimesButton' onClick={saveTimes}>Save Times</button>
    </div>
  );
};

export default AdminCalendar;