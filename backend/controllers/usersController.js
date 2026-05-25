const Users = require("../models/User");

const GetAll = async (req, res) => {
    try {
        const usersData = await Users.find({ role: "user" });
        return res.status(200).json({ message: "", data: usersData })
    } catch (error) {
        console.log("Error in fetching users=>", error);
        return res.status(500).json({ message: "Server Error Getting Users" });
    }
}

module.exports = { GetAll };