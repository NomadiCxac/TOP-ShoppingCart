import SetPaymentStatus from "../components/SetPaymentStatus";
import TopNavBar from "../components/TopNavBar";


const PaymentsPending = () => {
    
    const phase = "step1"


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