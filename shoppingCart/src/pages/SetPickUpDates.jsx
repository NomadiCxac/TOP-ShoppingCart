import { useEffect } from 'react';
import AdminCalendar from '../components/AdminCalendar'; // Adjust the path based on your file structure
import TopNavBar from '../components/TopNavBar';
import { useFirebase } from '../context/FirebaseContext';
import { getAuth } from 'firebase/auth';


const SetPickUpDates = () => {
  const { user, auth } = useFirebase()

  auth.currentUser.getIdTokenResult()
  .then((idTokenResult) => {
     console.log(idTokenResult.claims); // Here, you should see the admin claim if it's been set

  })
  .catch((error) => {
     console.log(error);
  });


  useEffect(() => {
    document.title = 'KSR - Set Pickup Dates';
    
    const auth = getAuth();
    const user = auth.currentUser;


    if (user) {
        console.log('User UID:', user.uid);
        // Retrieve the token result to check for admin custom claims
        user.getIdTokenResult().then((idTokenResult) => {
            // Log the admin status and the entire token for inspection
            console.log('Admin status:', idTokenResult.claims.admin);
            console.log('Token result:', idTokenResult);
        }).catch(error => console.log(error));
    } else {
        console.log('No user is signed in.');
    }
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