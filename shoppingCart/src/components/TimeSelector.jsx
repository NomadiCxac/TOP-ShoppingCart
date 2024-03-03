import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import './UserDashboard.css';
import './TimeSelector.css';

const TimeSelector = ({ onDateChange, onTimeChange, currentDate }) => {
  const date = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let initialMonthIndex = date.getMonth();
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();

  function createDateFromMonthDayYear(monthName, year, day) {
    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex === -1) {
      throw new Error("Invalid month name");
    }
    return new Date(year, monthIndex, day);
  }

  const [selectedMonth, setSelectedMonth] = useState(monthName);
  const [selectedDate, setSelectedDate] = useState(null);
  const [pickupDates, setPickUpDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const { getPickupTimesForDate, getPickupDatesForMonth } = useFirebaseOrders();

  async function fetchPickupDates(monthIndex, monthName) {
    setPickUpDates([]);
    setSelectedDate(null);
    setSelectedMonth(monthNames[monthIndex]);

    monthIndex += 1; // Adjust for Firebase DB retrieval
    if (monthIndex < 10) monthIndex = `0${monthIndex}_`;
    else monthIndex = `${monthIndex}_`;

    try {
      const pickupDates = await getPickupDatesForMonth(year, monthName, monthIndex);
      pickupDates.sort((a, b) => a - b);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

      const firstValidDateIndex = pickupDates.findIndex(date => {
        const candidateDate = createDateFromMonthDayYear(monthName, year, date);
        return candidateDate > today;
      });

      if (firstValidDateIndex !== -1) {
        const validDate = createDateFromMonthDayYear(monthName, year, pickupDates[firstValidDateIndex]);
        setPickUpDates(pickupDates);
        handleDateSelection(validDate);
        fetchTimes(validDate);
      }
    } catch (error) {
      console.error('Failed to fetch pickup dates:', error);
    }
  }

  async function fetchTimes(selectedDate) {
    setSelectedDate(selectedDate);
    try {
      const fetchedTimes = await getPickupTimesForDate(selectedDate);
      fetchedTimes.sort((a, b) => {
        const [hoursA, minutesA] = a.split(":").map(Number);
        const [hoursB, minutesB] = b.split(":").map(Number);
        return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
      });
      setAvailableTimes(fetchedTimes);
    } catch (error) {
      console.error('Failed to fetch times:', error);
    }
  }

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    onDateChange(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    onTimeChange(time);
  };

  useEffect(() => {
    fetchPickupDates(initialMonthIndex, selectedMonth);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedDate) {
        fetchTimes(selectedDate);
      }
    }, 500); // You may adjust the delay as needed
    return () => clearTimeout(handler);
  }, [selectedDate]);

  return (
    <div className='choosePickUpDateContainer'>
      <div className='calendarContainer'>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateSelection}
          onMonthChange={(month) => {
            const monthIndex = month.getMonth();
            setAvailableTimes([]);
            fetchPickupDates(monthIndex, monthNames[monthIndex]);
          }}
          filterDate={date => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dateString = date.getDate().toString();
            return date > today && pickupDates.includes(dateString);
          }}
          inline
        />
      </div>
      <div className='timeContainer'>
        <div className="timeGridContainer">
          {availableTimes.map((timeString, index) => (
            <button className="timeButton" key={index} onClick={() => handleTimeSelection(`${timeString} - ${timeString}`)}>
              {`${timeString} - ${timeString}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;