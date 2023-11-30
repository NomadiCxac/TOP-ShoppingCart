import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ShoppingCartPage from './pages/ShoppingCartPage';
// import CheckoutPage from './pages/CheckoutPage';
import ErrorPage from "./pages/ErrorPage";
import FoodMenu from "./components/FoodMenu";
// ... other imports

function AppRouter () {
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
        // ... other child routes
      ],
     },
//   {
//     path: "/shoppingCartPage",
//     element: <ShoppingCartPage />,
//     children: [
//       {
//         path: "checkout",
//         element: <CheckoutPage />,
//       },
//     ],
//   },
]);
  
return (<RouterProvider
    router={router}
  />)
}


export default AppRouter;