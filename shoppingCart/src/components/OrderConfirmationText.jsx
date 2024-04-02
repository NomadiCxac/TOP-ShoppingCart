import { useState, useEffect } from 'react';
import { FaRegCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'; // example icons
import './OrderConfirmationText.css';

const OrderConfirmationText = () => {
    const [stepCompleted, setStepCompleted] = useState(false);

    useEffect(() => {
        // Since step 1 is always complete, we set it to true on component mount
        setStepCompleted(true);
    }, []);

    return (
        <div>
            <div>
                <h2>Kitchen on Selwyn Rd</h2>
            </div>
            <div className="orderConfirmationStepsContainer">
                <div className="step1">
                   
                    <div>Order Code: -NuU8oVSxHQXKudjyySB</div>
                     {stepCompleted ? (
                         <div>
                             
                             Order Request Complete
                             <FaCheckCircle className="checkmark" />
                             </div>
                       
                    ) : (
                        <FaRegCircle />
                    )}
                   
                </div>
                <div className="step2">
                    <div>
                        Action Required:
                    </div>
                    <div>
                        Login to Complete Order
                        <FaExclamationTriangle className='stepActive'/>
                    </div>

                </div>
            </div>
            <div>
                <div className="nextStepTitle"> Thank you for your order request! </div>
                <div className="clientStep"> Your order is not yet complete and is currently <span>ON HOLD!</span> </div>
                <div className="clientStep"> Please follow the steps below to complete your order:</div>
                <div className="clientStep"> 1. Sign in with your reference code {"referenceCode"} or the Google email used with the order. </div>
                <div className="clientStep"> 2. Once logged in, access your orders and follow the steps to COMPLETE your order.</div>
                <div className="clientStep"> 3. A summary of your order and reference code has been sent to this email: {"email"}. Please check your spam folders. </div> 
            </div>
            
        </div>
    );
}

export default OrderConfirmationText;