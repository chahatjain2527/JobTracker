const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Provide Valid Email"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    subscriptionStatus: {
        type: String,
        enum: ['free', 'active', 'expired'],
        default: "free",
    },
    subscriptionEndDate: {
        type: Date
    },
},
    {
        timestamps: true
    }
);

// 🔐 PASSWORD HASHING MIDDLEWARE
UserSchema.pre("save", async function () {
    // Only hash if password is modified
    if (!this.isModified("password")) {
        return;
    }

    // Hash password
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);

});


// 🔎 COMPARE PASSWORD METHOD
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);