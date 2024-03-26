import { useEffect } from "react";
import OrderList from "../components/OrderList";
import TopNavBar from "../components/TopNavBar";


const OrderSearcher = () => {
    
    useEffect(() => {
        document.title = 'KSR - Search Orders';
      }, []);

    return (
        <div className='adminPageContent'>
            <TopNavBar 
                pageName={"Search Order"}
                searchBarOn={true}
            />
            <OrderList></OrderList>
        </div>
    )
}


export default OrderSearcher