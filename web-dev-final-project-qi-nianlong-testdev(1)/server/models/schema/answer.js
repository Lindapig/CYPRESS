const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        // define relevant properties.
        text: { type: String, required: true },
        ans_by: { type: String, required: true },
        ans_date_time: { type: Date, required: true, default: Date.now },
        comments: [{type:mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
        likes: [{type: String, required: true}],
    },
    { collection: "Answer" }
);
