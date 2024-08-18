import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("user-token")) || null);

    useEffect(() => {
        async function fetchUser() {
            try {
                console.log(authUser);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authUser.token}`,
                    },
                });

                if (response.status !== 200) {
                    setAuthUser(null);
                }
            } catch (err) {
                console.log(err);
            }
        }
        if(authUser)
        fetchUser();
    }, [authUser]);
    return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};
