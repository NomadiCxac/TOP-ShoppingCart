// import './CartDropdown.css'
import './OrderRequestSentDropdown.css'

const OrderRequestSentDropdown = ({ isVisible, onClose, className }) => {
    
    if (!isVisible) return null;

    return (
        <div className={className}>
            <div className="orderRequestDropdownDetails">
                <div className="nextStepsContainer"> 
                    <div className="nextStepTitle"> Thank you for your order request! </div>
                    <div className="clientStep"> Your order is currently <span>ON HOLD.</span> Please follow the steps below to complete your order. </div>
                    <div className="clientStep"> 1. Sign in with your reference code {"referenceCode"} or the Google email used with the order. </div>
                    <div className="clientStep"> 2. Once logged in, access your orders and follow the instructions to COMPLETE your order.</div>
                    <div className="clientStep"> 3. A summary of your order and reference code has been sent to this email: {"email"}. Please check your spam folders. </div> 
                </div>
                <p 
                    className="close-button" 
                    id="dropdown" 
                    aria-label="Close modal"
                    onClick={onClose}
                >
                    &times;
                </p>
            </div>
           
        </div>
    );
};

export default OrderRequestSentDropdown;