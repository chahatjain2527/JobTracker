const User = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { emailName, password } = req.body;
    if (!emailName || !password) {
      return res.status(400).json({ message: "Enter all required values" });
    }
    var emailNameData = emailName.trim().toLowerCase();
    
    var userData = await User.findOne({ $or: [{ email: emailNameData }, { name: emailNameData }] }).select("+password");

    if (userData) {
      var checkPass = await userData.comparePassword(password);
      if (!checkPass) {
        return res.status(400).json({ message: "Invalid Credential" });
      } else {
        const token = jwt.sign(
          { userId: userData._id, role: userData.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        return res.status(200).json({
          message: "Login successful",
          // user: userData,
          token,
        });
      }
    } else {
      return res.status(400).json({ message: "User not exist" });
    }
  } catch (error) {
    console.log("Login=> ", error);
    return res.status(500).json({ message: "Error In Login" });
  }
};

module.exports = { loginUser };
