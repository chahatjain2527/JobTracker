const express = require("express");
const router = express.Router();

const Users = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/getAll", authMiddleware.Protect, authMiddleware.AuthorizeRole("admin"), Users.GetAll);

module.exports = router;