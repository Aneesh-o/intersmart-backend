const users = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

// register
exports.registerController = async (req, res) => {
    console.log("inside register controler");
    const { username, email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(406).json("Already exisitng user...please login!!!")
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new users({
                username, email, password: hashedPassword
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(401).json(error)
    }
}

// login
exports.loginController = async (req, res) => {
    console.log("inside login controller");
    const { email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json("Incorrect Email/Password");
        }
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(404).json("Incorrect Email/Password");
        }
        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.jwtPassword,
            { expiresIn: "1h" }
        );
        res.status(200).json({ user: existingUser, token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

