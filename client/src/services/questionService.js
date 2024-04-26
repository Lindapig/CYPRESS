import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "") => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );

    return res.data;
};

// To get Questions by id
const getQuestionById = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);

    return res.data;
};

const getQuestionByIdPure = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionByIdPure/${qid}`);

    return res.data;
};

// To add Questions
const addQuestion = async (q) => {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

    return res.data;
};

const getQuestionsByUser = async () => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionByUser`);
    return res.data;
};

const updateQuestionById = async (qid, q) => {
    const res = await api.put(`${QUESTION_API_URL}/updateQuestionById/${qid}`, q);
    return res.data;
};

export { getQuestionsByFilter, getQuestionById, addQuestion, getQuestionsByUser, updateQuestionById, getQuestionByIdPure };
