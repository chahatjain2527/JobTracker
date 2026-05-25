const Application = require("../models/Application");

const createApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const { companyId, date } = req.body;
    if (!companyId || !date) {
      return res.status(400).json({ message: "Company or date not found" });
    }

    const appliedDate = date || new Date();
    const nextAllowedDate = new Date(appliedDate);
    nextAllowedDate.setMonth(nextAllowedDate.getMonth() + 6);

    const AppliData = await Application.findOne({
      UserId: userId,
      CompanyId: companyId,
    });
    if (!AppliData) {
      //not exist
      var application = new Application({
        UserId: userId,
        CompanyId: companyId,
        AppliedDate: appliedDate,
        NextAllowedDate: nextAllowedDate,
      });
      await application.save();
      return res
        .status(201)
        .json({ message: "Application Created Successfuly" });
    } else {
      //exists
      if (appliedDate > AppliData.NextAllowedDate) {
        AppliData.NextAllowedDate = nextAllowedDate;
        AppliData.AppliedDate = appliedDate;
        AppliData.Status = "applied";
        await AppliData.save();
        return res.status(200).json({ message: "ReApplied to Company" });
      } else {
        return res.status(400).json({
          message: "Apply After some time",
          NextAllowedDate: AppliData.NextAllowedDate,
        });
      }
    }
  } catch (error) {
    console.log("Appli Create Error=>", error);
    return res
      .status(500)
      .json({ message: "Server error creating application" });
  }
};

const getAllMyApplications = async (req, res) => {
  try {
    if (!req.user) {
      consoe.log("No user present");
      return res.status(400).json({ message: "No user found" });
    }
    var model = { UserId: req.user._id };
    if (req.query.Status != undefined && req.query.Status != "All") {
      model.Status = req.query.Status;
    }
    var appliList = await Application.find(model).populate("CompanyId", {
      companyName: 1,
      contactName: 1,
    });
    if (req.query.Name != "" && req.query.Name != undefined) {
      appliList = appliList.filter((item) =>
        item.CompanyId.companyName
          .toLowerCase()
          .includes(req.query.Name.toLowerCase())
      );
    }

    return res.status(200).json({
      data: appliList,
      message: "record fetched sucessfull",
      count: appliList.length,
    });
  } catch (error) {
    console.log("getAllMyApplications Error=>", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    if (!applicationId || !status) {
      return res.status(400).json({ message: "Enter Id and Status" });
    }
    var applicationData = await Application.findOne({ _id: applicationId });
    if (!applicationData) {
      return res.status(400).json({ message: "data not found for ID" });
    }
    if (applicationData.UserId.toString() != req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "application is not of current user" });
    }
    var validStatus = ["applied", "interview", "rejected", "offer"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "status is invalid" });
    }

    applicationData.Status = status;
    applicationData.AppliedDate = new Date();
    await applicationData.save();
    return res.status(200).json({
      message: "status updated successful",
      data: applicationData,
    });
  } catch (error) {
    console.log("Update status error=>", error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createApplication,
  getAllMyApplications,
  updateApplicationStatus,
};
