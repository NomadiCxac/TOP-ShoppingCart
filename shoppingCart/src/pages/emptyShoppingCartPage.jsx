import { Link } from "react-router-dom";
// import "./EmptyShoppingCartPage.css"; // Assuming you have specific styles for this page

const EmptyShoppingCart = () => {
    return (
        <div className="emptyShoppingCartContainer">
            <h2>Your Shopping Cart is Empty.</h2>
            <p>Your shopping cart is hungry for delicious baked goods.</p>
            <p>Continue shopping by going back to the <Link to="/">homepage.</Link></p>
            <p>Manage any outstanding orders <Link to="/orderManagement">here</Link></p>
        </div>
    );
};

export default EmptyShoppingCart;