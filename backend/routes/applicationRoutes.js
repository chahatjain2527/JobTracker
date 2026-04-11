const express = require("express");
const router = express.Router();

const Application = require("../controllers/applicationController")
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware.Protect, Application.createApplication);
router.get("/get", authMiddleware.Protect , Application.getAllMyApplications);
router.put("/updateStatus/:applicationId", authMiddleware.Protect , Application.updateApplicationStatus);

module.exports = router