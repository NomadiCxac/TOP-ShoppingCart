import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import useShoppingCart from './states/useShopingCart'
import LandingPage from "./pages/LandingPage";
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
// ... other imports

function AppRouter () {
  const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage/>,
    // loader: landingPageLoader, 
    children: [
      {
        path: "shoppingCartPage",
        element: <ShoppingCartPage/>,
        // loader: shoppingCartLoader, // If needed
      },
      {
        path: "checkOutPage",
        element: <CheckoutPage />,
        // loader: checkoutLoader, // If needed
      },
      // Additional routes can be added here
    ],  
  },
]);
  
return (<RouterProvider 
    router={router}
  />)
}


export default AppRouter;