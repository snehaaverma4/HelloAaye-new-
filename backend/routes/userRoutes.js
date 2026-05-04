// import express to create routes
const express = require("express");
const router = express.Router();

// import User model to save user data
const User = require("../models/User");

// import middleware that verifies Firebase token
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

// ROUTE: save or find user after OTP login
router.post("/create", verifyFirebaseToken, async function(req, res) {
  try {
    // Firebase UID (unique ID of user)
    const uid = req.user.uid;

    // check if user already exists in DB
    let user = await User.findOne({ uid: uid });

    // if user doesn't exist → create new user entry
    if (!user) {
      user = await User.create({
        uid: uid,
        phone: req.user.phone_number || "",
        email: req.user.email || ""
      });
    }

    // return the saved/found user as response
    res.json({
      message: "User profile saved successfully 😊",
      user: user
    });

  } catch (error) {
    // send error response if something goes wrong
    res.status(500).json({ 
      message: "Error creating user",
      error: error.message 
    });
  }
});

// export all routes inside router
module.exports = router;

