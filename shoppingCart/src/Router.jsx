import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import ErrorPage from "./pages/ErrorPage";
import FoodMenu from "./components/FoodMenu";
import OrderManagement from "./pages/OrderManagement";
import AdminPage from "./pages/AdminPage";
import UserDashboard from "./components/UserDashboard";
import { useFirebase } from "./context/FirebaseContext";
import SetPickUpDates from "./pages/SetPickUpDates";
// ... other imports

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
        {
          path: "orderManagement",
          element: <OrderManagement />,
        },
        {
          // Define UserDashboard as a sibling to OrderManagement
          path: "userDashboard",
          element: <UserDashboard />,
        },
        {
          path: "adminPage",
          element: isAdmin ? <AdminPage /> : <ErrorPage message="Unauthorized" />, // Only allow if user is an admin
        },
        {
          path: "setPickUpDates", // Nested route for the UserDashboard
          element: isAdmin ? <SetPickUpDates /> : <ErrorPage message="Unauthorized" />, // Only allow if user is an admin
        },

      ],
     },
]);
  
return (<RouterProvider
    router={router}
  />)
}


export default AppRouter;