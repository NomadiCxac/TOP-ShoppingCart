import OrderList from "../components/OrderList";


const SetOrderReady = () => {
    
    const phase = "step3"


    return (
        <div>
            <h1>Set Order Ready</h1>
            <OrderList
                phase={phase}
            />
                
        </div>
    )
}


export default SetOrderReady;