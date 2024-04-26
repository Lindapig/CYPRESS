const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();


// Adding answer
// const addAnswer = async (req, res) => {
//     const data = req.body;
//     const answer = data.ans;
//     const newAnswer = new Answer({
//         text: answer.text,
//         ans_by: answer.ans_by,
//         ans_date_time: answer.ans_date_time
//     });
//     await newAnswer.save();
//     if (mongoose.Types.ObjectId.isValid(data.qid)) {
//         const question = await Question.findById(data.qid).populate('answers');
//         question.answers.push(newAnswer);
//         await question.save();
//     }
    
//     res.json(newAnswer);
// };

// const addAnswer = async (req, res) => {
//     const data = req.body;
//     const answer = data.ans;
//     // const newAnswer = new Answer({
//     //     text: answer.text,
//     //     ans_by: answer.ans_by,
//     //     ans_date_time: answer.ans_date_time
//     // });
//     const newAnswer = Answer.create({
//         text: answer.text,
//     });
//     // await newAnswer.save();
//     const question = await Question.findOneAndUpdate(
//         { _id: data.qid },
//         { $push: { answers: newAnswer } },
//         { new: true }
//     );
//     res.json({"_id": question.answers[question.answers.length - 1], "text": answer.text});
//     // res.json(newAnswer);
// };


const addAnswer = async (req, res) => {
    const { qid, ans } = req.body;

    try {
        const newAnswer = await Answer.create({
            text: ans.text,
            ans_by: ans.ans_by, 
            ans_date: ans.ans_date,
        });

        // Adjust findOneAndUpdate call to match test expectations
        await Question.findOneAndUpdate(
            { _id: qid },
            { $push: { answers: { $each: [newAnswer._id], $position: 0 } } },
            { new: true }
        );

        res.json(newAnswer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "some error", error: error.message });
    }
};

//get answer by id
const getAnswerById = async (req, res) => {
    const aid = req.params.aid;
    const answer = await Answer.findById(aid).populate(
        {
            path: 'comments',
            model: 'Comment'
        }
    );
    if (!answer) {
        res.status(404).json({ message: "Answer not found" });
        return;
    }
    res.json(answer);
};



// add appropriate HTTP verbs and their endpoints to the router.
// await api.post(`${ANSWER_API_URL}/addAnswer`, data)
router.post("/addAnswer", addAnswer);
router.get("/getAnswerById/:aid", getAnswerById);

module.exports = router;
