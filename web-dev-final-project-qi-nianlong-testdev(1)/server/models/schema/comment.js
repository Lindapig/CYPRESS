const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        // define relevant properties.
        text: { type: String, required: true },
        com_by: { type: String, required: true },
        com_date_time: { type: Date, required: true, default: Date.now },
        likes: [{ type: String, required: true }],
    },
    { collection: "Comment" }
);
