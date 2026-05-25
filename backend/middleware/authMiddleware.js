const jwt = require("jsonwebtoken");
const User = require("../models/User");

const Protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const userData = async user.findOne({ email: decoded.email });
        const userData = await User.findOne({ _id: decoded.userId })
        if (!userData) {
            return res.status(401).json({ message: "User Not Found" });
        }
        req.user = userData;
        next();

    }
    catch (error) {
        console.log("Auth Midd=>", error);
        return res.status(401).json({ message: "Server Error" });
    }
};

const AuthorizeRole = (...role) => {
    try {
        return (req, res, next) => {
            if (!role.includes(req.user.role)) {
                return res.status(403).json({ message: "Access denied" });
            }
            next();
        }
    }
    catch (error) {
        console.log("authorizeRole error=>", error);
        return res.status(500).json({ message: "server error" });
    }
};

module.exports = { Protect, AuthorizeRole };
