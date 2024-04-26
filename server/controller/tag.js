const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

// const getTagsWithQuestionNumber = async (req, res) => {
//     // return all tags with the number of questions they are associated with
//     // name, qcnt
//     const tags = await Tag.aggregate([
//         {
//             $lookup: {
//                 from: "Question",
//                 localField: "_id",
//                 foreignField: "tags",
//                 as: "questions"
//             }
//         },
//         {
//             $project: {
//                 name: 1,
//                 qcnt: { $size: "$questions" }
//             }
//         }
//     ]);
//     res.json(tags);

// };
const getTagsWithQuestionNumber = async (req, res) => {
    try {
        const tags = await Tag.find(); // Fetch all tags
        const questions = await Question.find().populate('tags'); // Fetch all questions and populate their tags

        // Map through each tag to calculate question count
        const tagsWithQuestionCount = tags.map(tag => {
            const qcnt = questions.reduce((count, question) => {
                // Check if the current question includes the tag
                if (question.tags.some(t => t.name === tag.name)) {
                    count += 1;
                }
                return count;
            }, 0);

            // Return an object with the tag's name and question count
            return { name: tag.name, qcnt };
        });

        res.status(200).json(tagsWithQuestionCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tags with question numbers', error: error.message });
    }
};

// add appropriate HTTP verbs and their endpoints to the router.
router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber);

module.exports = router;
