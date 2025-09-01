import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    alert("Please login to access this page!");
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;

