// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
// const MONGO_URL = "mongodb://mongodb:27017/fake_so";
const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL = "http://localhost:3000";
const port = 8000;

mongoose.connect(MONGO_URL);

const app = express();

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);

app.use(express.json());

app.use(session({
    secret: "SESSIONID",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 20,
    }
}));

app.get("", (req, res) => {
    res.send("hello world");
    res.end();
});

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
// add user controller
const userController = require("./controller/user");
const commentController = require("./controller/comment");
const likeController = require("./controller/like");

// define authntication middleware
function authenticate(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};


app.use("/user", userController);
app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/comment", commentController);
app.use("/like", likeController);

// check login status, return username if logged in
app.get("/loginStatus", (req, res) => {
    if (req.session && req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});

module.exports = app
