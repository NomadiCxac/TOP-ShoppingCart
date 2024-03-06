import OrderList from "../components/OrderList";
import TopNavBar from "../components/TopNavBar";


const OrderSearcher = () => {
    


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