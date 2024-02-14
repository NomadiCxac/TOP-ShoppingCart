import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';


const TimeSelector = ({ selectedOrder }) => {

  const date = new Date()
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthIndex = date.getMonth() + 1
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();

  if (monthIndex < 10) {
      monthIndex = `0${monthIndex}_`;
  } 

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
  const { getPickupTimesForDate, getPickupDatesForMonth } = useFirebaseOrders(); // Assuming getPickupDates exists




  useEffect(() => {
    async function fetchPickupDates() {
      setPickUpDates([]);
      setSelectedDate(null); // Reset selected date when fetching new dates
      try {
        
        const pickupDates = await getPickupDatesForMonth(year, monthName, monthIndex);
        pickupDates.sort((a, b) => a - b)

        if (pickupDates.length > 0) {
          setSelectedDate(createDateFromMonthDayYear(monthName, year, pickupDates[0]))
          setPickUpDates(pickupDates);
        }

        console.log(selectedMonth);
        // Process pickupDates as needed here
      } catch (error) {
        console.error('Failed to fetch pickup dates:', error);
      }
    }

    fetchPickupDates();
  }, [selectedMonth, year]);

  useEffect(() => {
    if (!selectedDate) return; // Skip if selectedDate is not initialized

    const fetchTimes = async () => {
      try {
        console.log('Fetching times for:', selectedDate);
        const fetchedTimes = await getPickupTimesForDate(selectedDate) || [];
        fetchedTimes.sort((a, b) => {
          const [hoursA, minutesA] = a.split(":").map(Number);
          const [hoursB, minutesB] = b.split(":").map(Number);
          return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
        });
        setAvailableTimes(fetchedTimes);
        console.log(fetchedTimes);
      } catch (error) {
        console.error('Failed to fetch times:', error);
      }
    };
    fetchTimes();
  }, [selectedDate]);


  return (
    <div className='timeSelectorContainer'>
      <div id='title'>
        Available Pickup Dates
      </div>

      <div className='selectionContainer'>
        <div>
          <DatePicker
            selected={selectedDate} // Assuming you have a state variable `selectedDate` to manage the selected date
            onChange={(date) => {
              console.log('Date selected:', date);
              setSelectedDate(date);
            }}
            onMonthChange={(month) => {
              console.log(month)
              setSelectedMonth(month);
            }}
            filterDate={date => {
              // Convert the date being evaluated to its day as a string
              const dayString = date.getDate().toString();
              // Check if this day string matches any string in the pickupDates array
              return pickupDates.includes(dayString);
            }}
          inline
          />
        </div>
        <div></div>
      </div>

      <div className='confirmationContainer'>
        <div></div>
        <div></div>
      </div>

    </div>
  )
};

export default TimeSelector;