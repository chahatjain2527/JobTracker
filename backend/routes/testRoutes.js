// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");

// // Protected test route
// router.get("/protected", authMiddleware.Protect, (req, res) => {
//   res.status(200).json({
//     message: `Hello ${req.user.name}, your token is valid! ✅`,
//     user: {
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//     },
//   });
// });

// module.exports = router;