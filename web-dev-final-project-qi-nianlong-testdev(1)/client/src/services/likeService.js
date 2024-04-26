import { REACT_APP_API_URL, api } from "./config";

const Like_API_URL = `${REACT_APP_API_URL}/like`;

const clickLike = async (id, type, usrn) => {
    const data = { id: id, type: type, usrn: usrn };
    const res = await api.post(`${Like_API_URL}/clickLike`, data);
    return res.data;
};

const clickDislike = async (id, type, usrn) => {
    const data = { id: id, type: type, usrn: usrn };
    const res = await api.post(`${Like_API_URL}/clickDislike`, data);
    return res.data;
};

export { clickLike, clickDislike };