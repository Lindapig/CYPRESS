const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');
const { authenticate } = require('../utils/authentication');

const router = express.Router();

// const res = await api.get(
//     `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
// );

const getQuestionsByFilter = async (req, res) => {
    const { order, search } = req.query;
    let questions = await getQuestionsByOrder(order);
    if (search) {questions = filterQuestionsBySearch(questions, search);}
    res.json(questions);
};

//await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`)
// To get Questions by Id
// const getQuestionById = async (req, res) => {
//     const qid = req.params.qid;
//     const questions = await Question.find();
//     if (!questions) {
//         res.status(404).json({ message: "Questions not found" });
//         return;
//     }
//     // const question = questions.find((question) => question._id == qid);
//     // if (!question) {
//     //     res.status(500).json({ message: "Question not found" });
//     //     return;
//     // }

//     // const question = await Question.findById(qid);
//     // increase the number of views
//     // question.views += 1;
//     // await question.save();
//     res.json(qid);
// };
const getQuestionById = async (req, res) => {
    const qid = req.params.qid; 

    const question = await Question.findOneAndUpdate(
        { _id: qid },
        { $inc: { views: 1 } }, 
        { new: true } 
    ).populate('answers').populate('tags').populate('comments'); 
    if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
    }
    res.json(question);
};

// define a pure getQuestionById function
const getQuestionByIdPure = async (req, res) => {
    const qid = req.params.qid;
    const question = await Question.findById(qid).populate('answers').populate(
        {
            path: 'comments',
            model: 'Comment'
        }
    );
    if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
    }
    res.json(question);
};

// update a question by id
const updateQuestionById = async (req, res) => {
    const qid = req.params.qid;
    const question = await Question.findById(qid);
    if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
    }
    question.title = req.body.title;
    question.text = req.body.text;
    // save the updated question
    let r = await question.save();
    res.json(r);
};



const addQuestion = async (req, res) => {
    const question = req.body;
    const tags = question.tags;
    const newTags = [];
    for (const tag of tags) {
        const newTag = await addTag(tag);
        newTags.push(newTag);
    }
    // question.tags = newTags;
    // await new Question({
    //     title: question.title,
    //     text : question.text,
    //     asked_by : question.asked_by,
    //     ask_date_time : question.ask_date_time,
    //     tags : newTags}).save();
    let out = await Question.create({
        title: question.title,
        text : question.text,
        asked_by : question.asked_by,
        ask_date_time : question.ask_date_time,
        tags : newTags});
    // let populateQuestion = await newQuestion.save();
    // res.json(question);
    res.json(out);
};

// get question by username
const getQuestionByUser = async (req, res) => {
    const username = req.session.username;
    // return all questions asked by the user
    const questions = await Question.find({ asked_by: username }).populate('tags');
    res.json(questions);
};

// add appropriate HTTP verbs and their endpoints to the router
// `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
router.get("/getQuestion", getQuestionsByFilter);
router.get("/getQuestionById/:qid", getQuestionById);
router.get("/getQuestionByUser", authenticate, getQuestionByUser);
router.get("/getQuestionByIdPure/:qid", getQuestionByIdPure);
router.post("/addQuestion", authenticate ,addQuestion);
router.put("/updateQuestionById/:qid", authenticate, updateQuestionById);

module.exports = router;
