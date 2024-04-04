import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import 'react-datepicker/dist/react-datepicker.css';
import './AdminCalendar.css'
import { getAuth } from 'firebase/auth';

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timesForSelectedDate, setTimesForSelectedDate] = useState([]);
  const { getPickupTimesForDate, updatePickupTimesForDate } = useFirebaseOrders();

  
//   useEffect(() => {
    
//     console.log("This component rendered")
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//       user.getIdTokenResult(true).then((idTokenResult) => {
//           if (idTokenResult.claims.admin) {
//               // Now that we've confirmed the user is an admin, perform your database operation
//               updatePickupTimesForDate(selectedDate, timesForSelectedDate)
//                   .then(() => {
//                       alert('Times saved successfully.');
//                   })
//                   .catch(error => {
//                       console.error("Failed to save times due to:", error.message);
//                   });
//           } else {
//               console.log("The user is not an admin.");
//           }
//       }).catch(error => console.log("Error fetching updated token:", error));
//   } else {
//       console.log('No user is signed in.');
//   }
// }, []);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const fetchedTimes = await getPickupTimesForDate(selectedDate);
        setTimesForSelectedDate(fetchedTimes || []);
      } catch (error) {
        console.error('Failed to fetch times:', error);
      }
    };
    fetchTimes();
  }, [selectedDate]);

  const toggleTimeSelection = (time) => {
    setTimesForSelectedDate(currentTimes => {
      const updatedTimes = currentTimes.includes(time)
        ? currentTimes.filter(t => t !== time)
        : [...currentTimes, time];
      return updatedTimes;
    });
  };

  const saveTimes = async () => {
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