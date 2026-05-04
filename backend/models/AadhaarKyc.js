const mongoose = require("mongoose");

const aadhaarKycSchema = new mongoose.Schema({
  userUid: {
    type: String, // Firebase UID
    required: true,
    unique: true
  },
  aadhaarLast4: {
    type: String,
    required: true
  },
  aadhaarMasked: {
    type: String,
    required: true
  },
  // ⚠️ full aadhaar optional – store only if company insists
  aadhaarFull: {
    type: String,
    select: false
  },
  status: {
    type: String, // "pending", "verified", "rejected"
    default: "pending"
  },
  providerRefId: {
    type: String // KYC API ka reference/txn id
  },
  providerMessage: {
    type: String
  },
  verifiedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AadhaarKyc", aadhaarKycSchema);
