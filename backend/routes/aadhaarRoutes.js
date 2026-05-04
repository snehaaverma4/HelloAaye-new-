const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadAadhaar");
const User = require("../models/User");

router.post(
  "/upload",
  upload.single("aadhaarPdf"),
  async (req, res) => {
    try {
      const { uid, aadhaarNumber } = req.body;

      if (!uid || !aadhaarNumber || !req.file) {
        return res.status(400).json({ error: "Missing data" });
      }

      // mask aadhaar
      const masked =
        "XXXX-XXXX-" + aadhaarNumber.slice(-4);

      await User.findOneAndUpdate(
        { uid },
        {
          aadhaar: {
            maskedNumber: masked,
            pdfPath: req.file.path,
            status: "submitted",
          },
        }
      );

      res.json({ message: "Aadhaar uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
