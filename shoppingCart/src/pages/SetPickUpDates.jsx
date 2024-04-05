import { useEffect } from 'react';
import AdminCalendar from '../components/AdminCalendar'; // Adjust the path based on your file structure
import TopNavBar from '../components/TopNavBar';
import { useFirebase } from '../context/FirebaseContext';


const SetPickUpDates = () => {

  useEffect(() => {
    document.title = 'KSR - Set Pickup Dates';
}, []);

  return (
    <div className='adminPageContent'>
      <TopNavBar 
        pageName={"Set Pick Up Dates"}
      />
      <AdminCalendar />
    </div>
  );
};

export default SetPickUpDates;