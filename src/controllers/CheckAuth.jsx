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
    const { currentUser } = useAuth();

    useEffect(() => {
        const checkMongoUser = async () => {
            try {
                const response = await getUser(currentUser?.stsTokenManager?.accessToken);
                setHasMongoUser(!!response);
            } catch (error) {
                console.error("MongoDB user check failed:", error);
                setHasMongoUser(false);
            }
        };

        if (currentUser?.stsTokenManager?.accessToken) {
            checkMongoUser();
        }
    }, [currentUser]);

    if (!hasMongoUser) {
        return <Navigate to="/createprofile" /> // Kullanıcı profili yoksa profil oluşturma sayfasına yönlendir
    }

    return children;
}

export { CheckAuthFirebase, CheckAuth };
