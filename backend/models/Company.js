const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Provide Valid Email"],
    },
    contactPhone: { type: String, required: true },
    contactType: { type: String, enum: ["hr", "employee"], default: "hr" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, enum: ["admin", "user"], default: "user" },

},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Company", CompanySchema);