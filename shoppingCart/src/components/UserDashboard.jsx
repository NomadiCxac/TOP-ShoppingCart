import { useEffect, useState } from 'react';
import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useFirebase } from '../context/FirebaseContext'; // Import the useFirebase hook
import OrderCard from './OrderCard';
import Modal from './Modal';
import StepTracker from './StepTracker';
import TimeSelector from './TimeSelector';
import countItems from '../functions/countItems';
import formatName from '../functions/formatName';
import resolveImageUrl from '../functions/resolveImageUrl';
import { checkoutItemTotal } from '../functions/checkoutTotal';
// import Carousel from './Carousel';
import './Modal.css';
import './UserDashboard.css';
import { set } from 'firebase/database';

const UserDashboard = () => {
    const { user } = useFirebase(); // Use the useFirebase hook to access the current user
    const { retrieveOrdersByEmail, setDateAndTimeForOrder, updateOrderPhase} = useFirebaseOrders();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItemsArray, setOrderItemsArray] = useState([])
    const [isModalOpen, setModalOpen] = useState(false);
    const [orderPhase, setOrderPhase] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null); // Added for storing selected date
    const [selectedTime, setSelectedTime] = useState(null); // Added for storing selected time


    function formatDate(inputDate) {
        // Parse the input string into a Date object
        const date = new Date(inputDate);
      
        // Use toLocaleDateString to format the date as required
        // Specify the locale as 'en-US' and customize the format options
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC' // Ensure consistent behavior across different time zones
        });
      
        // Return the formatted date string
        return formattedDate;
      }


      const transformOrderItems = (order) => {
        if (!order || !order.items) return [];

        return Object.entries(order.items).map(([itemName, itemDetails]) => ({
            ...itemDetails,
            name: formatName(itemName), // Assuming formatName is a function that formats item names
            imageUrl: resolveImageUrl(itemDetails.id) // Assuming resolveImageUrl is a function that returns image URL
        }));
    };

    

    useEffect(() => {
        if (user) {
            const loadOrders = async (status = "incomplete") => {
                setLoading(true);
                try {
                    const userEmail = user.email; // Directly use the user's email from the Firebase context
                    const fetchedOrders = await retrieveOrdersByEmail(userEmail, status);
                    setOrders(fetchedOrders || []); // Ensure fetchedOrders is an array
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            loadOrders();
        }
    }, [user]); // Depend on user to re-fetch orders if the user changes

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
        setSelectedDate(null);
        setSelectedTime(null);
        setOrderPhase(order.orderPhase); // Update the orderPhase state based on the selected order's phase
        setOrderItemsArray(transformOrderItems(order))
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

        // Callback function to update selected date
    const handleDateChange = (date) => {
        console.log("Date selected:", date);
        setSelectedDate(date);
    };

    // Callback function to update selected time
    const handleTimeChange = (time) => {
        console.log("Time selected:", time);
        setSelectedTime(time);
    };

    const handleSetPickupDate = async (order, date, time) => {
        setIsSubmitting(true); // Begin the submission process
        try {
            // Wait for setDateAndTimeForOrder to complete
            await setDateAndTimeForOrder(order, date, time);
            await updateOrderPhase(order, "step2")
            setOrderPhase("step2");
            // After completion, handle success here if needed
        } catch (error) {
            // Handle any errors that might have been thrown in setDateAndTimeForOrder
            console.error("Error setting pickup date:", error);
        } finally {
            setIsSubmitting(false); // Ensure this runs even if there's an error
        }
    }

    useEffect(() => {
        console.log(orderPhase)
    }, [orderPhase])

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error fetching orders: {error}</p>;

    return (
        <div className="userDashboardContainer">
            {orders.length > 0 ? (
                <div className="ordersContainer">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => handleOpenModal(order)}
                        />
                    ))}
                </div>
            ) : (
                <p>You have no outstanding orders.</p>
            )}
            
            {selectedOrder && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} orientation={'top-right'} id="orderReview">

                    <div className='modalContentContainer'>
                        {orderPhase === 'step1' && (
                            <div className='orderStepsContainer'>

                                <StepTracker
                                    orderPhase = {orderPhase}
                                />

                            <div className="orderSummary" id="modal">
                                <div className="orderIdContainer" id='modal'> 
                                    {/* <h3>Order ID: {selectedOrder.id}</h3> */}
                                    <h3>Pickup Date Selected: {selectedDate} @ {selectedTime ? selectedTime : "Please Choose a Valid Time"}</h3>

                                </div>

                                <div className="orderConfirmationStatuses">
                                    <h5> Order Status: {selectedOrder.orderVerifiedStatus}</h5>
                                    <h5> Action Required: Select a pickup date and pickup time </h5>
                                </div>
                            </div>

                            <div className='pickUpDateContainer'> 
                                <div id='pickUpDateContainerTitle'>
                                    Please Select from the Available Pickup Dates:
                                </div>
                                <TimeSelector
                                    selectedOrder = {selectedOrder}
                                    onDateChange = {handleDateChange}
                                    onTimeChange = {handleTimeChange}
                                />

                                <div className='confirmPickUpDateContainer'>
                                    <button 
                                    onClick={() => handleSetPickupDate(selectedOrder, selectedDate, selectedTime)}
                                    className='confirmPickUpDateButton'
                                    disabled={!selectedDate || !selectedTime} // Button is disabled if either selectedDate or selectedTime is falsy
                                    >
                                    {selectedDate && selectedTime ? "Confirm Pick Up Date" : "Choose a Valid Time" }</button>
                                </div>
                            </div>
                        </div>
                        )}

                        {orderPhase === 'step2' && (
                        <div className='orderStepsContainer'>

                             <StepTracker
                                 orderPhase = {orderPhase}
                             />

                         <div className="orderSummary" id="modal">
                             <div className="orderIdContainer"  id="modal"> 
                                 {/* <h3>Order ID: {selectedOrder.id}</h3> */}
                                 <h3>Pickup Date Selected: {selectedOrder.pickUpDate} @ {selectedOrder.pickUpTime}</h3>
                             </div>

                             <div className="orderConfirmationStatuses">
                                 <h5> Order Status: {selectedOrder.clientPaid ? "Complete" : "Payment required"} </h5>
                                 <h5> Action Required: Please send payment to ksr@gmail.com via email etransfer to confirm your order and await next steps. </h5>
                                
                             </div>
                         </div>
                    

                         <div className='orderItemsContainer' id='modal'>
                             
                         <div className="orderImages" id='modal'>

                             <div className="orderReviewContainer" id='modal'>
                                {orderItemsArray.map((item) => (
                                <div className='orderItemContainer' id='modal' key={item.id + "-orderReview"}>

                                    <div className='orderItemContents' id='left'>
                                        <img className="orderIcon" key={item.id} src={resolveImageUrl(item.id)} alt={item.name} />
                                    <div className='orderItemDescription' id='left'>

                                    <div className='nameOfItem'>
                                        {formatName(item.id)}
                                    </div>

                                    {item.dozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='dozen'>
                                            {`Dozen ${formatName(item.id)} @ ${item.dozenQuantity} x ${item.dozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.halfDozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='halfDozen'>
                                            {`Half a Dozen ${formatName(item.id)} @ ${item.halfDozenQuantity} x ${item.halfDozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.quantity > 0 && item.batched === false && (
                                        <div className='itemBreakdown' id='singular'>
                                            {`${formatName(item.id)} @ ${item.quantity} x ${item.price.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                </div>
                            </div>

                                <div className='orderItemContents' id='right'>
                                    {checkoutItemTotal(item).toFixed(2) + " CAD"}
                                </div>
                            </div>
                            ))}
                            </div>

                            <div className="orderSubtotal" id='modal'>
                               {`Total: ${selectedOrder.subtotal.toFixed(2)} CAD`} 
                            </div> 

                             
                                </div>
                            </div> 
                        </div>
                        )}

                        {orderPhase === 'step3' && (
                        <div className='orderStepsContainer'>

                             <StepTracker
                                 orderPhase = {orderPhase}
                             />

                         <div className="orderSummary" id="modal">
                             <div className="orderIdContainer"  id="modal"> 
                                 {/* <h3>Order ID: {selectedOrder.id}</h3> */}
                                 <h3>Pickup Date Selected: {selectedOrder.pickUpDate} @ {selectedOrder.pickUpTime}</h3>
                             </div>

                             <div className="orderConfirmationStatuses">
                                 <h5> Order Status: {selectedOrder.readyForClientPickUp ? "Your order is ready! " : "Your payment was received. Your order is in the kitchen!"}</h5>
                                 <h5> Action Required: {selectedOrder.readyForClientPickUp ? "Pick up your order at the designated date and time" : "Please wait for your yummy order to be ready"}</h5>
                             </div>
                         </div>
                    

                         <div className='orderItemsContainer' id='modal'>
                             
                         <div className="orderImages" id='modal'>

                             <div className="orderReviewContainer" id='modal'>
                                {orderItemsArray.map((item) => (
                                <div className='orderItemContainer' id='modal' key={item.id + "-orderReview"}>

                                    <div className='orderItemContents' id='left'>
                                        <img className="orderIcon" key={item.id} src={resolveImageUrl(item.id)} alt={item.name} />
                                    <div className='orderItemDescription' id='left'>

                                    <div className='nameOfItem'>
                                        {formatName(item.id)}
                                    </div>

                                    {item.dozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='dozen'>
                                            {`Dozen ${formatName(item.id)} @ ${item.dozenQuantity} x ${item.dozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.halfDozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='halfDozen'>
                                            {`Half a Dozen ${formatName(item.id)} @ ${item.halfDozenQuantity} x ${item.halfDozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.quantity > 0 && item.batched === false && (
                                        <div className='itemBreakdown' id='singular'>
                                            {`${formatName(item.id)} @ ${item.quantity} x ${item.price.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                </div>
                            </div>

                                <div className='orderItemContents' id='right'>
                                    {checkoutItemTotal(item).toFixed(2) + " CAD"}
                                </div>
                            </div>
                            ))}
                            </div>

                            <div className="orderSubtotal" id='modal'>
                               {`Total: ${selectedOrder.subtotal.toFixed(2)} CAD`} 
                            </div> 

                             
                                </div>
                            </div> 
                        </div>
                        )}

                            <div className='closeButtonContainer'>
                                <p onClick={handleCloseModal} className="close-button" aria-label="Close modal">
                                    &times;
                                </p>
                            </div>
                    </div>
            </Modal>
            )}
        </div>
    );
};

export default UserDashboard;


