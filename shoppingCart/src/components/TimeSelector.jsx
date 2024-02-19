import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import './UserDashboard.css'
import './TimeSelector.css'


const TimeSelector = ({ onDateChange, onTimeChange }) => {

  const date = new Date()
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let initalMonthIndex = date.getMonth()
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();


  function createDateFromMonthDayYear(monthName, year, day) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = monthNames.indexOf(monthName); // Find the index of the monthName in the array
    
    if (monthIndex === -1) {
      throw new Error("Invalid month name");
    }
  
    // Create a Date object using the year, monthIndex, and day
    // Note: The monthIndex is zero-based in the Date constructor
    const date = new Date(year, monthIndex, day);
    return date;
  }

  const [selectedMonth, setSelectedMonth] = useState(monthName)
  const [selectedDate, setSelectedDate] = useState(null); // Initialized as null before fetching dates
  const [pickupDates, setPickUpDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const { getPickupTimesForDate, getPickupDatesForMonth} = useFirebaseOrders(); // Assuming getPickupDates exists

  async function fetchPickupDates(monthIndex, monthName) {
    setPickUpDates([]);
    setSelectedDate(null); // Reset selected date when fetching new dates
    setSelectedMonth(monthNames[monthIndex])
    
    // addition for proper data retrieval in Firebase DB
    monthIndex = monthIndex + 1;

    if (monthIndex < 10) {
      monthIndex = `0${monthIndex}_`
    } else {
      monthIndex = `${monthIndex}_`
    }
  
    try {
      
      const pickupDates = await getPickupDatesForMonth(year, monthName, monthIndex);
      pickupDates.sort((a, b) => a - b)
      let firstDate = createDateFromMonthDayYear(monthName, year, pickupDates[0])
      
      if (pickupDates.length > 0) {
        setPickUpDates(pickupDates);
        handleDateSelection(firstDate); 
        fetchTimes(firstDate); // Use firstDate directly
      }

      // Process pickupDates as needed here
    } catch (error) {
      console.error('Failed to fetch pickup dates:', error);
    }
  }

  
  async function fetchTimes (selectedDate) {
    setSelectedDate(selectedDate); // Reset selected date when fetching new dates
    try {
      const fetchedTimes = await getPickupTimesForDate(selectedDate);
      fetchedTimes.sort((a, b) => {
        const [hoursA, minutesA] = a.split(":").map(Number);
        const [hoursB, minutesB] = b.split(":").map(Number);
        return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
      });
      setAvailableTimes(fetchedTimes);
      console.log(availableTimes)
    } catch (error) {
      console.error('Failed to fetch times:', error);
    }
  }

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    const dateString = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    onDateChange(dateString); // Pass the formatted string instead of the Date object
    console.log(dateString); // Confirm the conversion in the console
  };

  // Method to handle time selection
  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    onTimeChange(time); // Notify the parent component of the new time
    console.log(time)
  };


  // Initial Fetch for orders in the month
  useEffect(() => {
    fetchPickupDates(initalMonthIndex, selectedMonth);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedDate) {
        fetchTimes(selectedDate);
      }
    }); // Adjust the delay based on user experience needs
  
    return () => clearTimeout(handler); // Cleanup timeout if the effect runs again before the timeout completes
  }, [selectedDate]);


  return (
    <div className='choosePickUpDateContainer'>


      <div className='calendarContainer'>
          <DatePicker
            selected={selectedDate} // Assuming you have a state variable `selectedDate` to manage the selected date
            onChange={handleDateSelection}
            onMonthChange={(month) => {
              let monthIndex = month.getMonth()
              setAvailableTimes([]);
              fetchPickupDates(monthIndex, monthNames[monthIndex]);
            }}
            filterDate={date => {
              const isInCurrentMonth = date.getMonth() === new Date(selectedDate).getMonth();
              const isInCurrentYear = date.getFullYear() === new Date(selectedDate).getFullYear();
              const dayString = date.getDate().toString();
            
              // Ensure the date is included in the pickupDates array and is in the current month
              return pickupDates.includes(dayString) && isInCurrentMonth && isInCurrentYear;
            }}
          inline
          />
        </div>

      <div className='timeContainer'>
        <div className="timeGridContainer">
          {availableTimes.map((timeString, index) => {
          // Assuming availableTimes format is like "6:00", "7:00"...
          const [hours, minutes] = timeString.split(':').map(Number); // Convert hours and minutes to numbers
          const nextHour = hours + 1; // Increment the hour
          const endTime = `${nextHour}:${minutes < 10 ? '00' : minutes}`; // Format the end time string
          const timeRange = `${timeString} - ${endTime}`; // Create the time range string

            return (
              <button className="timeButton" key={index} onClick={() => handleTimeSelection(timeRange)}>
                {timeRange}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )
};

export default TimeSelector;