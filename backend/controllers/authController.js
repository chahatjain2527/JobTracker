const { model } = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Enter all required values" });
        }
        var existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exist" });
        }
        const user = await User.create({
            name,
            email,
            password
        });
        user.password = undefined;
        const token = jwt.sign(
            {userId:user._id,role:user.role,userName:user.name},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(201).json({
            message: "User Created successful",
            user: user,
            token
        })
    }
    catch (error) {
        console.log("Auth=> ",error);
        return res.status(500).json({ message: "Error Creating User" });
    }
};
module.exports = { registerUser };