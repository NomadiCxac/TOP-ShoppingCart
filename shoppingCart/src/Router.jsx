import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import ErrorPage from "./pages/ErrorPage";
import FoodMenu from "./components/FoodMenu";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import UserDashboard from "./components/UserDashboard";
import { useFirebase } from "./context/FirebaseContext";
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
          path: "loginPage",
          element: <LoginPage />,
          children: [
            {
              path: "userDashboard", // Nested route for the UserDashboard
              element: <UserDashboard />,
            },
          ],
        },
        {
          path: "adminPage",
          element: isAdmin ? <AdminPage /> : <ErrorPage message="Unauthorized" />, // Only allow if user is an admin
        },
      ],
     },
]);
  
return (<RouterProvider
    router={router}
  />)
}


export default AppRouter;