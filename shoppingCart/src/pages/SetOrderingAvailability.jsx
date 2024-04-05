
import { useEffect } from "react";
import TopNavBar from "../components/TopNavBar";
import { useFirebase } from "../context/FirebaseContext";
import './SetOrderingAvailability.css'
import { getAuth } from 'firebase/auth';


const SetOrderingAvailability = () => {
    const { isOrderingAvailable, switchOrderingAvailability, isOrderCodeNotificationAvailable, switchOrderCodeNotificationAvailability } = useFirebase();

    useEffect(() => {
      document.title = 'KSR - Ordering Availability';
      
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