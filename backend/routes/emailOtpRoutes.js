// const express = require("express");

// function generateEmailTemplate(otp) {
//   return `
//   <div style="
//     font-family: Arial, sans-serif;
//     background-color: #f4f7ff;
//     padding: 30px;
//   ">
//     <div style="
//       max-width: 450px;
//       margin: auto;
//       background: white;
//       border-radius: 12px;
//       padding: 25px 30px;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.08);
//     ">
//       <h2 style="
//         color: #1e5cff;
//         text-align: center;
//         font-size: 22px;
//         margin-bottom: 6px;
//       ">
//         Hello Aaye Email Verification
//       </h2>

//       <p style="
//         font-size: 13px;
//         color: #777;
//         text-align: center;
//         margin-top: 0;
//         margin-bottom: 18px;
//       ">
//         Secure verification for your Hello Aaye account
//       </p>

//       <p style="font-size: 15px; color: #333; margin-bottom: 8px;">
//         Hi,
//       </p>

//       <p style="
//         font-size: 15px;
//         color: #333;
//         margin-bottom: 20px;
//       ">
//         Use the OTP below to verify your email address for <b>Hello Aaye</b>.
//       </p>

//       <div style="
//         background: #1e5cff;
//         color: white;
//         padding: 15px 20px;
//         text-align: center;
//         border-radius: 8px;
//         font-size: 28px;
//         letter-spacing: 5px;
//         font-weight: bold;
//       ">
//         ${otp}
//       </div>

//       <p style="
//         margin-top: 20px;
//         font-size: 14px;
//         color: #666;
//       ">
//         This OTP is valid for <b>5 minutes</b>.<br/>
//         Please <b>do not share</b> this code with anyone, including Hello Aaye
//         representatives.
//       </p>

//       <p style="
//         font-size: 13px;
//         color: #999;
//         margin-top: 20px;
//       ">
//         If you did not request this, you can safely ignore this email.
//       </p>

//       <p style="
//         font-size: 13px;
//         color: #bbb;
//         margin-top: 25px;
//         text-align: center;
//       ">
//         © ${new Date().getFullYear()} Hello Aaye. All rights reserved.
//       </p>
//     </div>
//   </div>
//   `;
// }

// const router = express.Router();

// const EmailOtp = require("../models/EmailOtp");
// const createEmailTransporter = require("../config/email");

// // helper: 6-digit OTP
// function generateOtp() {
//   var otp = Math.floor(100000 + Math.random() * 900000);
//   return String(otp);
// }

// console.log("📤 Sending mail...");

// // ========== 1) Send Email OTP ==========
// router.post("/send-email-otp", async function (req, res) {
//   console.log("🔥 SEND EMAIL OTP ROUTE HIT");
//   console.log("📦 BODY:", req.body);
//   try {
//     var email = req.body.email;
//     console.log("📩 EMAIL:", email);


//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     // 🔹 1) Last OTP record find karo
//     var lastOtp = await EmailOtp.findOne({ email: email }).sort({ createdAt: -1 });

//     if (lastOtp) {
//       var now = Date.now();
//       var lastTime = lastOtp.createdAt.getTime();
//       var diffSeconds = (now - lastTime) / 1000;

//       // Agar 30 sec ke andar phir se resend karne ki koshish
//       if (diffSeconds < 30) {
//         return res.status(429).json({
//           message:
//             "Please wait " +
//             Math.ceil(30 - diffSeconds) +
//             " seconds before resending OTP",
//         });
//       }
//     }

//     // 🔹 2) Naya OTP generate + expiry
//     var otp = generateOtp();
//     var expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

//     // old records delete kar do (optional but clean)
//     await EmailOtp.deleteMany({ email: email });

//     await EmailOtp.create({
//       email: email,
//       otp: otp,
//       expiresAt: expiresAt,
//     });

//     var transporter = createEmailTransporter();

//     // 🔹 YAHAN PE STYLISH TEMPLATE + Hello Aaye BRANDING USE KAR RHE HAIN
//     var mailOptions = {
//       from: '"Hello Aaye" <' + process.env.EMAIL_USER + '>',
//       to: email,
//       subject: "Hello Aaye - Your Email Verification OTP",
//       html: generateEmailTemplate(otp),
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log("Email send error:", error);
//         return res
//           .status(500)
//           .json({ message: "Failed to send OTP email", error: error.message });
//       } else {
//         console.log("Email sent: " + info.response);
//         return res.json({ message: "OTP sent to email" });
//       }
//     });
//   } catch (error) {
//     console.log("Send email OTP error:", error);
//     return res.status(500).json({
//       message: "Server error sending email OTP",
//       error: error.message,
//     });
//   }
// });

// // ========== 2) Verify Email OTP ==========
// router.post("/verify-email-otp", async function (req, res) {
//   try {
//     var email = req.body.email;
//     var otp = req.body.otp;

//     if (!email || !otp) {
//       return res
//         .status(400)
//         .json({ message: "Email and OTP are required" });
//     }

//     // latest record for this email
//     var record = await EmailOtp.findOne({ email: email }).sort({
//       createdAt: -1,
//     });

//     if (!record) {
//       return res
//         .status(400)
//         .json({ message: "No OTP found for this email" });
//     }

//     if (record.verified) {
//       return res.json({ message: "Email already verified", success: true });
//     }

//     if (record.expiresAt < new Date()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     if (record.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     record.verified = true;
//     await record.save();

//     return res.json({
//       message: "Email verified successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.log("Verify email OTP error:", error);
//     return res.status(500).json({
//       message: "Server error verifying email OTP",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;

