const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    CompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    AppliedDate: { type: Date, required: true },
    Status: { type: String, enum: ["applied", "interview", "rejected", "offer"], required: true, default: "applied" },
    NextAllowedDate: { type: Date },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Application", ApplicationSchema)