import { useEffect } from 'react';
import AdminCalendar from '../components/AdminCalendar'; // Adjust the path based on your file structure
import TopNavBar from '../components/TopNavBar';
import { useFirebase } from '../context/FirebaseContext';

const SetPickUpDates = () => {
  const { user } = useFirebase()

  useEffect(() => {
    document.title = 'KSR - Set Pickup Dates';
    console.log(user)
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