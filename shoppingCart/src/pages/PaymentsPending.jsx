import OrderList from "../components/OrderList";
import SetPaymentStatus from "../components/SetPaymentStatus";


const PaymentsPending = () => {
    
    const phase = "step1"


    return (
        <div>
            <SetPaymentStatus
                phase={phase}
            />
                
        </div>
    )
}


export default PaymentsPending;