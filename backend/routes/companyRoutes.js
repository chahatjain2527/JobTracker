const express = require("express");
const router = express.Router();

const Company = require("../controllers/companyController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware.Protect , Company.createCompany);
router.get("/get", authMiddleware.Protect , Company.getCompany);
router.get("/pending", authMiddleware.Protect, Company.getPendingCompany);
router.put("/updateStatus/:id", authMiddleware.Protect, authMiddleware.AuthorizeRole("admin") , Company.UpdateCompanyStatus);

module.exports = router;