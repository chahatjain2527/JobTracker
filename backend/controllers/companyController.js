const Company = require("../models/Company");

const createCompany = async (req, res) => {
    try {
        const { companyName, contactEmail, contactPhone, contactName } = req.body;
        if (!companyName || !contactEmail || !contactName) {
            return res.status(400).json({ message: "Enter all values" });
        }
        var checkEmail = await Company.findOne({ contactEmail: contactEmail });
        if (checkEmail) {
            return res.status(400).json({ message: "Email Already Present" });
        }
        else {
            const user = req.user;
            let status = "pending"
            let source = "user";

            if (user.role == "admin") {
                status = "approved";
                source = "admin";
            }

            const company = new Company({
                companyName,
                contactName,
                contactEmail,
                contactPhone,
                contactType: "hr",
                status,
                source,
                createdBy: user._id
            });
            await company.save();
            return res.status(200).json({
                message: "Company Created Successful",
                data: company,
            });
        }
    } catch (error) {
        console.log("Company create error", error);
        return res.status(500).json({ message: "Server Error Creating Company",error: error.message });
    }
};

const getCompany = async (req, res) => {
    try {
        const company = await Company.find({ status: "approved" });
        res.status(200).json({
            message: "Record Fetched successful",
            recordCount: company.length,
            data: company
        });
    }
    catch (error) {
        console.log("Company get error", error);
        return res.status(500).json({ message: "Server Error Getting Company" });
    };
};

const getPendingCompany = async (req, res) => {
    try {
        
        var model = {
            status: "pending"
        };
        if(req.user.role == "user"){
            model.createdBy  = req.user._id;
        }

        const pendingList = await Company.find(model).populate("createdBy",{name:1,email:1});
        return res.status(200).json({
            message: "Record Fetch SuccessFull",
            data: pendingList,
            recordCount: pendingList.length
        });
    }
    catch (error) {
        console.log("Pen Com=>", error);
        return res.status(500).json({ message: "Server Error Getting Pending Record" });
    }
};

const UpdateCompanyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;


        if (!id || !status) {
            return res.status(400).json({ message: "Enter Id and Status" });
        }

        const companyData = await Company.findOne({ _id: id });
        if (!companyData) {
            return res.status(400).json({ message: "data not found for ID" });
        }
        var validStatus = ["pending", "approved","rejected"];
        if(!validStatus.includes(status))
        {
            return res.status(400).json({ message: "status is invalid" });
        }
        companyData.status = status;
        await companyData.save();
        return res.status(200).json({
            message: "status updated Successful",
            data: companyData,
        }); 
    }
    catch (error) {
        console.log("Error in update status=>", error);
        return res.staus(500).json({ message: "Server Error" });
    }

}

module.exports = { createCompany, getCompany, getPendingCompany, UpdateCompanyStatus };