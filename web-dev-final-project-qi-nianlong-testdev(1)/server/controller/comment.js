const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const Comment = require("../models/comments");

const router = express.Router();


const addComment = async (req, res) => {
    const { id, type, comment } = req.body;

    try {
        const newComment = await Comment.create({
            text: comment.text,
            com_by: comment.com_by, 
            com_date_time: comment.com_date_time,
        });
        let updatedResult;
        if (type == "question") {
            updatedResult = await Question.findOneAndUpdate(
                { _id: id },
                { $push: { comments: { $each: [newComment._id], $position: 0 } } },
                { new: true }
            );
        } else if (type == "answer") {
            updatedResult = await Answer.findOneAndUpdate(
                { _id: id },
                { $push: { comments: { $each: [newComment._id], $position: 0 } } },
                { new: true }
            );
        }
        res.json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "some error", error: error.message });
    }
};

router.post("/addComment", addComment);

module.exports = router;
