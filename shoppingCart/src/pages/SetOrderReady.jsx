
import SetProductionStatus from "../components/SetProductionStatus";
import TopNavBar from "../components/TopNavBar";


const SetOrderReady = () => {
    
    const phase = "step3"


    return (
        <div className='adminPageContent'>
            <TopNavBar 
                pageName={"Set Production Status"}
            />
            <SetProductionStatus
                phase={phase}
            />
                
        </div>
    )
}


export default SetOrderReady;