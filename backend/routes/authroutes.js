const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// SEND EMAIL OTP
router.post("/send-email-otp", async (req, res) => {
  try {
    const { email, uid } = req.body;

    if (!email || !uid) {
      return res.status(400).json({ message: "Email and UID required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await User.findOneAndUpdate(
      { uid },
      {
        email,
        emailOtp: otp,
        emailOtpExpires: expiry,
      },
      { new: true, upsert: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "sneha22verma4@gmail.com",
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.log("SEND EMAIL OTP ERROR:", err.message);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// VERIFY EMAIL OTP
router.post("/verify-email-otp", async (req, res) => {
  try {

    console.log("🔥 VERIFY ROUTE HIT");
    console.log("BODY 👉", req.body);

    const uid = req.body.uid;
    const otp = req.body.otp;

    if (!uid || !otp) {
      return res.status(400).json({
        success: false,
        message: "UID and OTP required"
      });
    }

    const user = await User.findOne({ uid: uid });

    if (!user || !user.emailOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found"
      });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (new Date() > user.emailOtpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    user.emailOtp = "";
    user.emailOtpExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err) {
    console.log("VERIFY EMAIL OTP ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
