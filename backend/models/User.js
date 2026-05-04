// import mongoose to define schema & interact with MongoDB
const mongoose = require("mongoose");

// creating the user structure (schema)
const userSchema = new mongoose.Schema({
  
  // Firebase provides a unique user ID for every logged-in user
  uid: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // phone number from Firebase (optional because email login also possible)
  phone: { 
    type: String 
  },

  // email from Firebase (optional because phone-only login exists)
  email: { 
    type: String 
  },

// Email OTP verification
emailOtp: {
  type: String,
  default: "",
},
emailOtpExpires: {
  type: Date,
},

  // automatically store when user was created
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

// Basic profile
fullName: { type: String, default: "" },
panNumber: { type: String, default: "" },

  // Aadhaar
aadhaar: {
  maskedNumber: { type: String, default: "" },
  pdfPath: { type: String, default: "" },
  status: {
    type: String,
    enum: ["not_submitted", "submitted", "verified", "rejected"],
    default: "not_submitted"
  }
},

// Address
address: {
  details: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
  },
  proof: {
    filePath: { type: String, default: "" },
    status: {
      type: String,
      enum: ["not_submitted", "submitted", "verified", "rejected"],
      default: "not_submitted",
    },
  },
},


// Police verification
policeStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
policeReportPath: { type: String, default: "" },

// Bank details
bank: {
  accountNumber: { type: String, default: "" },
  ifsc: { type: String, default: "" },
  bankName: { type: String, default: "" },
  proofPath: { type: String, default: "" }, // bankProofPath
},

// Photos
residencePhotos: {
  type: [String],
  default: [],
},
officePhotos: {
  type: [String],
  default: [],
},

});

// exporting our User model to use in routes
module.exports = mongoose.model("User", userSchema);
