import AdminCalendar from '../components/AdminCalendar'; // Adjust the path based on your file structure
import TopNavBar from '../components/TopNavBar';

const SetPickUpDates = () => {
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