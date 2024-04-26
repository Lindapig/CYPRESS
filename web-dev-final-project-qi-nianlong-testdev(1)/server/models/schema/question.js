const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
    {
        // define the relevant properties.
        title: {type: String, required: true},
        text: {type: String, required: true},
        asked_by: {type: String, required: true},
        ask_date_time: {type: Date, required: true, default: Date.now},
        views: {type: Number, required: true, default: 0},
        tags:[{type:mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
        answers:[{type:mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
        comments: [{type:mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
        likes: [{type: String, required: true}],
    },
    { collection: "Question" }
);
