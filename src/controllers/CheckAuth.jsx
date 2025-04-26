import { Navigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/authContext/page";

const CheckAuth = ({ children }) => {
    
    const { userLoggedIn } = useAuth();

    if (!userLoggedIn) {
        return <Navigate to="/login" />;
    }
    
    return children;
}

export default CheckAuth;
