import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ShoppingCartPage from './components/ShoppingCartPage';
import CheckoutPage from './components/CheckoutPage';
import Root from './components/Root';
// ... other imports

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader, // Assuming rootLoader is defined
    children: [
      {
        path: "shoppingCartPage",
        element: <ShoppingCartPage />,
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

export default Router;