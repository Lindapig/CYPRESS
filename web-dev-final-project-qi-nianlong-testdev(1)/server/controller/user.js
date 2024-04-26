const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");

const router = express.Router();

// user input sanity check


const register = async (req, res) => {
    const { username, password } = req.body;
    // console.log(username);
    try {
        // fist check if user already exists
        const user = await
        User.findOne({ username });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const newUser = await User.create({
            username,
            password: bcrypt.hashSync(password, 10),
        });
        // assign session
        req.session.username = newUser.username;
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        // assign session
        req.session.username = user.username;
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// log out
const logout = (req, res) => {
    req.session.destroy();
    res.json({ message: "logged out" });
}

// is logged in
const isLoggedIn = (req, res) => {
    if (req.session && req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/isLoggedIn", isLoggedIn);

module.exports = router;