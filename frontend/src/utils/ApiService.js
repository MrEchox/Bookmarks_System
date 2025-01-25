import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Authorization api calls -----------------------------------------------------
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/token/`, {
            username : username,
            password : password,
            headers : {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // { accessToken, refreshToken }
    } catch (error) {
        throw error;
    }
};

export const register = async (username, password ) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            username: username,
            password : password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/token/refresh`, {
            refreshTokenId: refreshToken,
        });
        return response.data; // { accessToken }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
};
// ------------------------------------------------------------------------------