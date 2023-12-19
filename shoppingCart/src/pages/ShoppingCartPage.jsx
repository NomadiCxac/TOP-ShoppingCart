// import "./ShoppingCartPage.css"
import FinalizeShoppingCart from "../components/finalizeShoppingCart";
import SubtotalChecker from "../components/SubtotalChecker";
import '../App.css';

const ShoppingCartPage = () => {


    return (
    
    <div id="shoppingCartPage">
      <FinalizeShoppingCart/>
      <SubtotalChecker />
    </div>
       
    )
}

export default ShoppingCartPage;