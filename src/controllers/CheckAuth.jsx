import { Navigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/authContext/page";
import { getUser } from "@/src/controllers/UserRequest";
import { useEffect, useState } from "react";

const CheckAuthFirebase = ({ children }) => {
    const { userLoggedIn } = useAuth();

    if (!userLoggedIn) {
        return <Navigate to="/login" />;
    }
    
    return children;
}

const CheckAuth = ({ children }) => {
    const [hasMongoUser, setHasMongoUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const checkMongoUser = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                const response = await getUser(currentUser?.stsTokenManager?.accessToken);
                console.log("MongoDB user check response:", response);
                if (response?.data?.success) {
                    setHasMongoUser(true);
                } else {
                    setHasMongoUser(false);
                }
            } catch (error) {
                console.error("MongoDB user check failed:", error);
                setHasMongoUser(false);
            } finally {
                setLoading(false);
            }
        };

        checkMongoUser();
    }, [currentUser]);

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (!hasMongoUser && currentUser) {
        return <Navigate to="/createprofile" />;
    }

    return children;
}

export { CheckAuthFirebase, CheckAuth };
