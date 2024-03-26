import { useEffect } from "react";
import SetPaymentStatus from "../components/SetPaymentStatus";
import TopNavBar from "../components/TopNavBar";


const PaymentsPending = () => {
    
    const phase = "step1"

    useEffect(() => {
        document.title = 'KSR - Set Payment Status';
      }, []);


    return (
        <div className='adminPageContent'>
            <TopNavBar 
                pageName={"Set Payments Status"}
            />
            <SetPaymentStatus
                phase={phase}
            />
                
        </div>
    )
}


export default PaymentsPending;