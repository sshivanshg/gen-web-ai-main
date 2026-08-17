import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
    const { userData } = useSelector((state) => state.user);
    const location = useLocation();

    if (!userData) {
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }

    return children;
};

export default RequireAuth;
