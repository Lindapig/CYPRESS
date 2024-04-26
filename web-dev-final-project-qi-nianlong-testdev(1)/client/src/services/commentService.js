import { REACT_APP_API_URL, api } from "./config";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

// To add comment
const addComment = async (id, type, comment) => {
    const data = { id: id, type: type, comment: comment };
    const res = await api.post(`${COMMENT_API_URL}/addComment`, data);
    return res.data;
};

export { addComment };