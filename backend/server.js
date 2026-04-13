const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors({origin:"https://jobtracker-frontend-sigma.vercel.app"}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoute);
app.use("/api/company", companyRoutes);
app.use("/api/application", applicationRoutes);
// app.use("/api/test", testRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT,"0.0.0.0", () => console.log("Server running on port ",PORT));
  })
  .catch((err) => console.log(err));

module.exports = app;