import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Axios interceptor --------------------------------
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axios.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { access } = await refreshToken(refreshToken);
                localStorage.setItem('token', access);
                axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return axios(originalRequest);
            } catch (err) {
                console.error("Token refresh failed:", err);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// ------------------------------------------------------------------------------

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

export const register = async (email, password, username ) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register/`, {
            username: username,
            email: email,
            password : password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
        });
        return response.data; // { access, refresh }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
};
// ------------------------------------------------------------------------------

// Workspace api calls ----------------------------------------------------------
export const getWorkspaces = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/workspaces/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createWorkspace = async (workspaceData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/workspaces/`, {
            title: workspaceData.name,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteWorkspace = async (workspaceId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/workspaces/delete/${workspaceId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ------------------------------------------------------------------------------

// Bookmark api calls -----------------------------------------------------------
export const getBookmarks = async (workspaceId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/workspaces/${workspaceId}/bookmarks/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBookmark = async (workspaceId, bookmarkData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/workspaces/${workspaceId}/bookmarks/`, {
            title: bookmarkData.name,
            url: bookmarkData.url,
            tag: bookmarkData.tag || null
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateBookmark = async (workspaceId, bookmarkId, bookmarkData) => {
    console.log("bookmarkData", bookmarkData);
    try {
        const response = await axios.put(`${API_BASE_URL}/workspaces/${workspaceId}/bookmarks/update/${bookmarkId}/`, {
            title: bookmarkData.title,
            url: bookmarkData.url,
            tag: bookmarkData.tag || null
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteBookmark = async (workspaceId, bookmarkId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/workspaces/${workspaceId}/bookmarks/delete/${bookmarkId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
// ------------------------------------------------------------------------------

// Util api calls ---------------------------------------------------------

export const checkUrlStatus = async (url) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/check-url/`, {
            url: url
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};