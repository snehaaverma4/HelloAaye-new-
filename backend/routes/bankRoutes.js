const express = require("express");
const router = express.Router();
const VerificationRequest = require("../models/VerificationRequest");
const geocodeAddress = require("../utils/geocode");

// Bank creates verification request
router.post("/verification-request", async (req, res) => {
  try {
    const { applicantName, addressText, verificationType, bankRefId } = req.body;

    // Address → lat/lng
    const coords = await geocodeAddress(addressText);

    const request = await VerificationRequest.create({
      user: {
        name: applicantName,
        addressText,
      },
      verificationType,
      location: coords,
      status: "pending",
      source: "bank",
      bankRefId, // for bank tracking
    });

    res.json({ message: "Verification request created", request });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
