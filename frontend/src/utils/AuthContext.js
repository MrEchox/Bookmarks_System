import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { login as loginApiCall, refreshToken as refreshAccessToken } from "./ApiService";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!isLoggedOut && token) {
            const decodedToken = jwtDecode(token);

            // Check if the token is expired
            if (decodedToken.exp * 1000 > Date.now()) {
                setAuthState(decodedToken);
                setUserId(decodedToken.user_id);
                scheduleTokenRefresh(decodedToken, refreshToken); // Schedule token refresh
            } else {
                logout();
            }
        } else {
            setIsAuthed(false);
        }
    }, []);

    const setAuthState = (decodedToken) => {
        setIsAuthed(true);
        setUserToken(decodedToken);
    };

    const scheduleTokenRefresh = (decodedToken, refreshToken) => {
        const timeUntilExpiry = decodedToken.exp * 1000 - Date.now() - 5000; // Refresh 5 seconds before expiration
        if (timeUntilExpiry > 0) {
            setTimeout(() => handleTokenRefresh(refreshToken), timeUntilExpiry);
        }
    };

    const handleTokenRefresh = async (refreshToken) => {
        try {
            const response = await refreshAccessToken(refreshToken);
            const newAccessToken = response.access;

            // Save the new token and update state
            localStorage.setItem("token", newAccessToken);
            const decodedNewToken = jwtDecode(newAccessToken);
            setAuthState(decodedNewToken);
            scheduleTokenRefresh(decodedNewToken, refreshToken); // Schedule the next refresh
        } catch (error) {
            console.error("Token refresh failed:", error);
            logout();
        }
    };

    // Login function
    const login = async (username, password) => {
        try {
            const response = await loginApiCall(username, password);
            const { access, refresh } = response;

            // Save tokens in localStorage
            localStorage.setItem("token", access);
            localStorage.setItem("refreshToken", refresh);
            setIsLoggedOut(false);

            const decodedToken = jwtDecode(access);
            setUserToken(access);
            setAuthState(decodedToken);
            setUserId(decodedToken.user_id);

            // Schedule the first token refresh
            scheduleTokenRefresh(decodedToken, refresh);
        } catch (error) {
            console.error("Login failed:", error);
            throw new Error("Invalid credentials");
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setIsLoggedOut(true);
        setIsAuthed(false);
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthed, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
