import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Import auth check function

const ProtectedRoute = ({ isAuthRequired }: { isAuthRequired: boolean }) => {
    const auth = isAuthenticated();

    if (isAuthRequired && !auth) {
        return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }

    if (!isAuthRequired && auth) {
        return <Navigate to="/" replace />; // Redirect to home if already logged in
    }

    return <Outlet />; // Render the requested page
};

export default ProtectedRoute;
