import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useFirebase } from "./context/FirebaseContext";

// import pages
import LandingPage from "./pages/LandingPage";
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import ErrorPage from "./pages/ErrorPage";
import OrderManagement from "./pages/OrderManagement";
import AdminPage from "./pages/AdminPage";
import SetPickUpDates from "./pages/SetPickUpDates";
import OrderRequestSent from "./pages/OrderRequestSentPage";
import OrderSearcher from "./pages/OrderSearcher";
import PaymentsPending from "./pages/PaymentsPending";
import SetOrderReady from "./pages/SetOrderReady";
import SetOrderingAvailability from "./pages/SetOrderingAvailability";


// import components
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import FoodMenu from "./components/FoodMenu";
import UserDashboard from "./components/UserDashboard";



function AppRouter () {

  const { isAdmin } = useFirebase();

  const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage/>,
    // loader: landingPageLoader, 
    errorElement: <ErrorPage />,
        children: [
        {
          index: true, // This represents the default child route of "/"
          element: <FoodMenu />,
        },
        {
          path: "shoppingCartPage",
          element: <ShoppingCartPage />,
        },
        {
          path: "checkoutPage", // New route for the checkout page
          element: <CheckoutPage />,
        },

        // Dynamic routing to the orderManagement page to extract the orderId code
        {
          path: "orderManagement/:orderId",
          element: <OrderManagement />,
        },

        // Base routing
        {
          path: "orderManagement",
          element: <OrderManagement />, // The base page without an orderId
        },
        {
          // Define UserDashboard as a sibling to OrderManagement
          path: "userDashboard",
          element: 
          <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>,
        },
        {
          path: "adminPage",
          element: isAdmin ? <AdminPage /> : <ErrorPage message="Unauthorized" />, // Only allow if user is an admin
          children: [
            {
              path: "setPickUpDates", // Make this a nested route under adminPage
              element: <SetPickUpDates />,
            },
            {
              path: "orderSearcher", // Make this a nested route under adminPage
              element: <OrderSearcher />,
            },
            {
              path: "paymentsPending", // Make this a nested route under adminPage
              element: <PaymentsPending />,
            },
            {
              path: "setOrderReady", // Make this a nested route under adminPage
              element: <SetOrderReady />,
            },
            {
              path: "setOrderingAvailability", // Make this a nested route under adminPage
              element: <SetOrderingAvailability />,
            },

            // Add other child routes as needed
          ],
        },
        // {
        //   path: "orderRequestSent/:orderId",
        //   element: <OrderRequestSent />,
        // },

      ],
     },
]);
  
return (<RouterProvider
    router={router}
  />)
}


export default AppRouter;