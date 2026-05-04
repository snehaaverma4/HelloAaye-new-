// models/PanVerification.js

const mongoose = require("mongoose");

const panVerificationSchema = new mongoose.Schema({
  userUid: {
    type: String, // Firebase UID (req.user.uid se)
    required: true
  },
  panNumber: {
    type: String,
    required: true
  },
  status: {
    type: String, // e.g. "pending", "verified", "rejected"
    default: "verified"
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PanVerification", panVerificationSchema);
