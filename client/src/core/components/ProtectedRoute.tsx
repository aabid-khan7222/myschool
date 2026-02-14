import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../data/redux/authSlice";
import { all_routes } from "../../feature-module/router/all_routes";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={all_routes.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
