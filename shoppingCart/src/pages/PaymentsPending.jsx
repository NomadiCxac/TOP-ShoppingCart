import OrderList from "../components/OrderList";


const PaymentsPending = () => {
    
    const phase = "step2"


    return (
        <div>
            <h1>Payments Pending</h1>
            <OrderList
                phase={phase}
            />
                
        </div>
    )
}


export default PaymentsPending;