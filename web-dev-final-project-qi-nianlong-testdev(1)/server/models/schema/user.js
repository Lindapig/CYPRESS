const mongoose = require("mongoose");

// Schema for user
module.exports = mongoose.Schema(
    {
        // define relevant properties.
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { collection: "User" }
);
