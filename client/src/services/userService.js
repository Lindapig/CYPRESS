import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/user`;

// To login
const login = async (username, password) => {
    const data = { username: username, password: password };
    // const res = await api.post(`${ANSWER_API_URL}/login`, data);
    // if successful login
    try {
        const res = await api.post(`${ANSWER_API_URL}/login`, data);
        if (res.status === 200) {
            return res.data;
        }
        if (res.status === 400) {
            return { message: res.data.message };
        }
    }
    catch (error) {
        return { message: error.response.data.message };
    }
};

// To register
const register = async (username, password) => {
    const data = { username: username, password: password };
    // const res = await api.post(`${ANSWER_API_URL}/register`, data);
    // if successful registration
    try {
        const res = await api.post(`${ANSWER_API_URL}/register`, data);
        if (res.status === 200) {
            return res.data;
        }
        if (res.status === 400) {
            return { message: res.data.message };
        }
    }
    catch (error) {
        return { message: error.response.data.message };
    }
};

// To logout
const logout = async () => {
    const res = await api.post(`${ANSWER_API_URL}/logout`);
    return res.data;
};
// check if user is logged in
const isLoggedIn = async () => {
    const res = await api.get(`${REACT_APP_API_URL}/loginStatus`);
    return res.data;
};


export { login, register, logout, isLoggedIn};
