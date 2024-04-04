
import { useEffect } from "react";
import TopNavBar from "../components/TopNavBar";
import { useFirebase } from "../context/FirebaseContext";
import './SetOrderingAvailability.css'
import { getAuth } from 'firebase/auth';


const SetOrderingAvailability = () => {
    const { isOrderingAvailable, switchOrderingAvailability, isOrderCodeNotificationAvailable, switchOrderCodeNotificationAvailability, isAdmin } = useFirebase();

    useEffect(() => {
      document.title = 'KSR - Ordering Availability';
      
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

    const handleSetOrderingAvailable = async () => {
        await switchOrderingAvailability()
    }

    const handleSetOrderCodeNotifcationAvailable = async () => {
      await switchOrderCodeNotificationAvailability()
  }

    useEffect(() => {
        document.title = 'KSR - Ordering Availability';
      }, []);



    return (
        <div className='adminPageContent'>
          <TopNavBar 
            pageName={"Admin Controls"}
          />

          <div>
              {isOrderingAvailable ? "Ordering Available Status: ON" : "Ordering Available Status: OFF"}
          </div>

          <button className="ordering-availability-switch" onClick={handleSetOrderingAvailable}>
              <span 
                  className="material-symbols-outlined icon"
                  id={isOrderingAvailable ? "enabled" : "disabled"}
              >
                  {isOrderingAvailable ? "toggle_on" : "toggle_off"}
              </span>
          </button>

          <div>
              {isOrderCodeNotificationAvailable? "Email Order Code Available Status: ON" : "Email Order Code Available Status: OFF"}
          </div>

          <button className="ordering-availability-switch" onClick={handleSetOrderCodeNotifcationAvailable}>
              <span 
                  className="material-symbols-outlined icon"
                  id={isOrderCodeNotificationAvailable ? "enabled" : "disabled"}
              >
                  {isOrderCodeNotificationAvailable ? "toggle_on" : "toggle_off"}
              </span>
          </button>
        </div>
      );
}


export default SetOrderingAvailability;