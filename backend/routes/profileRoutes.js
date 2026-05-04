const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");
const User = require("../models/User");
const uploadAddress = require("../middlewares/uploadAddress");


// 1) Full name
router.post("/fullname", verifyFirebaseToken, async (req, res) => {
  try {
    const { fullName} = req.body;

    if (!fullName || fullName.trim().length < 3) {
      return res.status(400).json({ message: "Full name is required" });
    }

const user = await User.findOneAndUpdate(
  { uid: req.user.uid },
  {
    uid: req.user.uid,          // ensure uid stored
    fullName: fullName.trim(),
  },
  { new: true, upsert: true }   // 🔥 THIS IS THE KEY
);

    return res.json({ message: "Full name saved", user });
  } catch (err) {
    console.error("fullname error:", err);
    return res.status(500).json({ message: "Error saving full name" });
  }
});

// 2) PAN
router.post("/pan", verifyFirebaseToken, async (req, res) => {
  try {
    const { panNumber } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { panNumber },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "PAN saved", user });
  } catch (err) {
    console.error("pan error:", err);
    return res.status(500).json({ message: "Error saving PAN" });
  }
});

// 3) Address
// Address details (TEXT ONLY)
router.post("/address/details", verifyFirebaseToken, async (req, res) => {
  try {
    const { line1, line2, city, state, pincode } = req.body;

    if (!line1 || !city || !state || !pincode) {
      return res.status(400).json({ message: "Incomplete address details" });
    }

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        "address.details": {
          line1,
          line2,
          city,
          state,
          pincode,
        },
      },
      { new: true }
    );

    res.json({
      message: "Address details saved",
      address: user.address,
    });
  } catch (err) {
    console.error("address details error:", err);
    res.status(500).json({ message: "Error saving address details" });
  }
});


// Address proof upload  
router.post(
  "/address/proof",
  verifyFirebaseToken,
  uploadAddress.single("addressProof"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Address proof required" });
      }

      const user = await User.findOneAndUpdate(
        { uid: req.user.uid },
        {
          "address.proof.filePath": `/uploads/address/${req.file.filename}`,
          "address.proof.status": "submitted",
        },
        { new: true }
      );

      res.json({
        message: "Address proof uploaded",
        address: user.address,
      });
    } catch (err) {
      console.error("address proof error:", err);
      res.status(500).json({ message: "Error uploading address proof" });
    }
  }
);




// 4) Police verification (status / remarks abhi simple)
router.post("/police", verifyFirebaseToken, async (req, res) => {
  try {
    const { policeStatus } = req.body; // "pending" / "approved" / "rejected"

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { policeStatus },
      { new: true }
    );

    return res.json({ message: "Police verification updated", user });
  } catch (err) {
    console.error("police error:", err);
    return res
      .status(500)
      .json({ message: "Error saving police verification" });
  }
});

// 5) Bank details
router.post("/bank", verifyFirebaseToken, async (req, res) => {
  try {
    const { accountNumber, ifsc, bankName } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        bank: { accountNumber, ifsc, bankName },
      },
      { new: true }
    );

    return res.json({ message: "Bank details saved", user });
  } catch (err) {
    console.error("bank error:", err);
    return res.status(500).json({ message: "Error saving bank details" });
  }
});

module.exports = router;

// 6) Aadhaar
router.post("/aadhaar", verifyFirebaseToken, async (req, res) => {
  try {
    console.log("🔥 AADHAAR ROUTE HIT 🔥", req.user.uid);
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({ message: "Invalid Aadhaar number" });
    }

    const masked =
      "XXXX-XXXX-" + aadhaarNumber.slice(-4);

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        aadhaar: {
          maskedNumber: masked,
          status: "submitted"
        }
      },
      { new: true }
    );

    res.json({
      message: "Aadhaar submitted successfully",
      aadhaar: user.aadhaar
    });

  } catch (err) {
    console.error("aadhaar save error:", err);
    res.status(500).json({ message: "Error saving Aadhaar" });
  }
});


// 7) Aadhaar PDF upload
const uploadAadhaar = require("../middlewares/uploadAadhaar");

router.post(
  "/aadhaar/upload",
  verifyFirebaseToken,
  uploadAadhaar.single("aadhaarPdf"),
  async (req, res) => {
    try {
      console.log("🔥 AADHAAR ROUTE HIT 🔥", req.user.uid);
      if (!req.file) {
        return res.status(400).json({ message: "PDF file required" });
      }

      const user = await User.findOneAndUpdate(
        { uid: req.user.uid },
        {
          "aadhaar.pdfPath": req.file.path,
          "aadhaar.status": "submitted",
        },
        { new: true }
      );

      res.json({
        message: "Aadhaar PDF uploaded",
        aadhaar: user.aadhaar,
      });
    } catch (err) {
      console.error("aadhaar pdf error:", err);
      res.status(500).json({ message: "Error uploading Aadhaar PDF" });
    }
  }
);

// aadhaar verification
// 8) Aadhaar verification (UIDAI-ready, admin / API based)
router.post("/aadhaar/verify", async (req, res) => {
  try {
    const { uid, decision } = req.body;
    // decision = "verified" | "rejected"

    if (!uid || !decision) {
      return res.status(400).json({ message: "Missing data" });
    }

    if (!["verified", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const user = await User.findOneAndUpdate(
      { uid },
      {
        "aadhaar.status": decision,
      },
      { new: true }
    );

    res.json({
      message: `Aadhaar ${decision}`,
      aadhaar: user.aadhaar,
    });
  } catch (err) {
    console.error("aadhaar verify error:", err);
    res.status(500).json({ message: "Error verifying Aadhaar" });
  }
});
