// routes/panRoutes.js

const express = require("express");
const router = express.Router();

const PanVerification = require("../models/PanVerification");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

// ✅ Helper: PAN format check
function isValidPan(pan) {
  // PAN pattern: 5 letters, 4 digits, 1 letter
  var panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

// (Future) External PAN verify - abhi sirf dummy
async function verifyPanWithExternalService(panNumber) {
  // yahan future me bank API / govt API call kar sakte ho
  // abhi ke liye assume kar rahe valid hai
  return {
    success: true,
    message: "PAN verified (dummy / format based)"
  };
}

// =========================
// POST /api/pan/verify
// =========================

router.post("/verify", verifyFirebaseToken, async function(req, res) {
  try {
    var panNumber = req.body.panNumber;

    if (!panNumber) {
      return res.status(400).json({ message: "PAN number is required" });
    }

    // uppercase me convert kar lo
    panNumber = panNumber.toUpperCase();

    // basic format check
    if (!isValidPan(panNumber)) {
      return res.status(400).json({ message: "Invalid PAN format" });
    }

    // external / dummy verification
    var result = await verifyPanWithExternalService(panNumber);

    if (!result.success) {
      return res.status(400).json({ message: "PAN failed verification", details: result.message });
    }

    var userUid = req.user.uid; // verifyFirebaseToken ne set kiya hai

    // Agar same user ne pehle PAN verify kiya hai to update kar do
    var existing = await PanVerification.findOne({ userUid: userUid });

    if (existing) {
      existing.panNumber = panNumber;
      existing.status = "verified";
      existing.verifiedAt = new Date();
      await existing.save();
    } else {
      await PanVerification.create({
        userUid: userUid,
        panNumber: panNumber,
        status: "verified",
        verifiedAt: new Date()
      });
    }

    return res.json({
      message: "PAN verified and saved successfully",
      panNumber: panNumber,
      status: "verified"
    });

  } catch (error) {
    console.log("PAN verify error:", error);
    return res.status(500).json({
      message: "Server error while verifying PAN",
      error: error.message
    });
  }
});

// =========================
// GET /api/pan/my
// =========================

router.get("/my", verifyFirebaseToken, async function(req, res) {
  try {
    var userUid = req.user.uid;

    var record = await PanVerification.findOne({ userUid: userUid });

    if (!record) {
      return res.status(404).json({ message: "No PAN record found for user" });
    }

    return res.json({
      panNumber: record.panNumber,
      status: record.status,
      verifiedAt: record.verifiedAt
    });

  } catch (error) {
    console.log("Get PAN error:", error);
    return res.status(500).json({
      message: "Server error while fetching PAN details",
      error: error.message
    });
  }
});

module.exports = router;
