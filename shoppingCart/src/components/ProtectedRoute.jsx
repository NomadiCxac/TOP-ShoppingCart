import { Navigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";

const ProtectedRoute = ({ children, redirectPath = '/orderManagement' }) => {
  const { user } = useFirebase();
  if (!user) {
    // If there's no user, redirect to the specified path
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default ProtectedRoute;