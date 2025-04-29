/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isLogged, setIsLogged] = useState(false);

    function getUserInfo() {
        return authService.me();
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    return <AuthContext.Provider
        value={{
            isLogged,
            setIsLogged,
        }}
    >
        { children }
    </AuthContext.Provider>
}