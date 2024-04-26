const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const Comment = require("../models/comments");

const router = express.Router();

const clickLike = async (req, res) => {
    const { id, type, usrn } = req.body;
    // console.log(typeof usrn);
    try {
        let updatedResult;
        if (type == "question") {
            updatedResult = await Question.findOneAndUpdate(
                { _id: id },
                { $push: { likes: { $each: [usrn], $position: 0 } } },
                { new: true }
            );
        } else if (type == "answer") {
            updatedResult = await Answer.findOneAndUpdate(
                { _id: id },
                { $push: { likes: { $each: [usrn], $position: 0 } } },
                { new: true }
            );
        }
        else if (type == "comment") {
            updatedResult = await Comment.findOneAndUpdate(
                { _id: id },
                { $push: { likes: { $each: [usrn], $position: 0 } } },
                { new: true }
            );
        }
        res.json(updatedResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "some error", error: error.message });
    }
}

const clickDislike = async (req, res) => {
    const { id, type, usrn } = req.body;
    // console.log(typeof usrn);
    try {
        let updatedResult;
        if (type === "question") {
            updatedResult = await Question.findOneAndUpdate(
                { _id: id },
                { $pull: { likes: usrn } },
                { new: true }
            );
        } else if (type === "answer") {
            updatedResult = await Answer.findOneAndUpdate(
                { _id: id },
                { $pull: { likes: usrn } },
                { new: true }
            );
        } else if (type === "comment") {
            updatedResult = await Comment.findOneAndUpdate(
                { _id: id },
                { $pull: { likes: usrn } },
                { new: true }
            );
        }
        res.json(updatedResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "some error", error: error.message });
    }
}

router.post("/clickLike", clickLike);
router.post("/clickDislike", clickDislike);

module.exports = router;