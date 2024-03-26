
import { useEffect } from "react";
import SetProductionStatus from "../components/SetProductionStatus";
import TopNavBar from "../components/TopNavBar";
import { useFirebase } from "../context/FirebaseContext";
import './SetOrderingAvailability.css'


const SetOrderingAvailability = () => {
    const { isOrderingAvailable, switchOrderingAvailability } = useFirebase();

    const handleSetOrderingAvailable = async () => {
        await switchOrderingAvailability()
    }

    useEffect(() => {
        document.title = 'KSR - Ordering Availability';
      }, []);

    useEffect(() => {
        console.log(isOrderingAvailable)
    }, [isOrderingAvailable])


    return (
        <div className='adminPageContent'>
          <TopNavBar 
            pageName={"Set Ordering Availability"}
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
        </div>
      );
}


export default SetOrderingAvailability;