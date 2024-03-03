import OrderList from "../components/OrderList";
import SetProductionStatus from "../components/SetProductionStatus";


const SetOrderReady = () => {
    
    const phase = "step3"


    return (
        <div>
            <SetProductionStatus
                phase={phase}
            />
                
        </div>
    )
}


export default SetOrderReady;