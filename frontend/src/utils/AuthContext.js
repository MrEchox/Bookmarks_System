import React, { createContext, useContext, useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import { login as loginApiCall} from "./ApiService";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setUserToken(token);

        if (token) {
            const decodedToken = jwtDecode(token);
            setAuthState(decodedToken);
            setUserId(decodedToken.user_id);
        } else {
            setIsAuthed(false);
        }
    }, []);

    const setAuthState = (decodedToken) => {
        if (decodedToken.exp < Date.now() / 1000) {
            console.warn("Token has expired");
            logout();
            return;
        }
        setIsAuthed(true);
    }

    // Login function
    const login = async (username, password) => {
        try {
            const response = await loginApiCall(username, password); // Make API call
            const token = response.access;
            localStorage.setItem("token", token);
            console.log("Login successful, token:", token);

            let decodedToken = jwtDecode(token);
            setUserToken(token);
            setAuthState(decodedToken);
        } catch (error) {
            console.error("Login failed:", error);
            throw new Error("Invalid credentials");
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthed(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthed, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};