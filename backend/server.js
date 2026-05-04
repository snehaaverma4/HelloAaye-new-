const express = require("express");  
require("dotenv").config();  // links your env file here so that u can use the data, link and keys, etc
require("./config/firebaseAdmin");
const app = express();

// connect database
const connectDB = require("./config/db");
connectDB();

app.use(express.json());   //So that your backend can read frontend data like { "phone": "9999999999" }

const cors = require("cors");
app.use(cors());   //as frontend and backend are different

console.log("✅ Firebase Admin connected successfully");

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");  //http://localhost:5000/  -- link to open the local webpage
});

// whenever someone calls your /api/user/profile route, your backend will check if their Firebase token is valid
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

// email-otp route
const authRoutes = require("./routes/authroutes");
app.use(express.json());
app.use("/api/auth",authRoutes);
// console.log("OTP RECEIVED RAW 👉", otp);
// console.log("TYPE OF OTP 👉", typeof otp);

// pan number verification
const panRoutes = require("./routes/panRoutes");
app.use(express.json());
app.use("/api/pan", panRoutes);

//aadhaar verification
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const aadhaarRoutes = require('./routes/aadhaarRoutes');
app.use('/api/aadhaar', aadhaarRoutes);
app.use("/uploads", express.static("uploads")); // for aadhaar upload to be public so that it can be opened in browser through link

// user data store
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

const executiveRoutes = require("./routes/executiveRoutes");
app.use("/api/executive", executiveRoutes);

// server start
const PORT = process.env.PORT || 5000;  // ||- this means or else- if non port no. found in env then use 5000
app.listen(PORT, '0.0.0.0', function() {
  console.log("Server running on port " + PORT);
});






