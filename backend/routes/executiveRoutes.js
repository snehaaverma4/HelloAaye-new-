const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const VerificationRequest = require("../models/VerificationRequest");
const calculateDistance = require("../utils/calculateDistance");

// GET requests for executive dashboard
router.get("/requests", async (req, res) => {
  // try {
  //   const { lat, lng, executiveId } = req.query;

  //   if (!lat || !lng || !executiveId) {
  //     return res.status(400).json({ message: "Location & executiveId required" });
  //   }

  //   const requests = await VerificationRequest.find({
  //     status: { $in: ["pending", "assigned"] },
  //     $or: [
  //       { assignedTo: null },
  //       { assignedTo: executiveId }
  //     ],
  //     skippedExecutives: { $ne: executiveId },
  //   });
    
  //   console.log("QUERY EXECUTIVE 👉", executiveId);
  //   console.log("RAW REQUESTS 👉", requests);

  //   const filtered = requests
  //     .map(reqItem => {
  //       console.log("DISTANCE 👉", reqItem._id, distanceKm);
  //       const distanceKm = calculateDistance(
  //         parseFloat(lat),
  //         parseFloat(lng),
  //         reqItem.location.lat,
  //         reqItem.location.lng
  //       );

  //       return {
  //         requestId: reqItem._id,
  //         user: reqItem.user,
  //         verificationType: reqItem.verificationType,
  //         location: reqItem.location,
  //         status: reqItem.status,
  //         distanceKm: Number(distanceKm.toFixed(2)),
  //       };
  //     })
  //     .filter(item => item.distanceKm >= 0.5)
  //     .sort((a, b) => a.distanceKm - b.distanceKm);

  //   res.json(filtered);
  // } catch (err) {
  //   console.error("Executive fetch error:", err);
  //   res.status(500).json({ message: "Server error" });
  // }

  try {
  const { lat, lng, executiveId } = req.query;

  if (!lat || !lng || !executiveId) {
    return res.status(400).json({
      message: "Location & executiveId required",
    });
  }

  console.log("QUERY EXECUTIVE 👉", executiveId);

  const requests = await VerificationRequest.find({
    status: "pending",
    assignedTo: null,
  }).lean();

  console.log("RAW REQUESTS 👉", requests);

  const filtered = requests
    .map((reqItem) => {
      const distanceKm = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        Number(reqItem.location?.lat || 0),
        Number(reqItem.location?.lng || 0)
      );

      console.log("DISTANCE 👉", reqItem._id, distanceKm);

      return {
        requestId: reqItem._id,
        user: reqItem.user || {},
        verificationType: reqItem.verificationType,
        location: reqItem.location,
        status: reqItem.status,
        distanceKm: Number(distanceKm.toFixed(2)),
      };
    })
    .filter((item) => item.distanceKm >= 0.5)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  console.log("FINAL 👉", filtered);

  res.json(filtered);

} catch (err) {
  console.error("Executive fetch error FULL 👉", err);
  res.status(500).json({ message: "Server error" });
}

});

// Accept request
router.post("/request/accept", async (req, res) => {
  try {
    const { requestId, executiveId } = req.body;

    if (!requestId || !executiveId) {
      return res.status(400).json({ message: "requestId and executiveId required" });
    }

    // Atomic lock: update only if not already accepted
    const request = await VerificationRequest.findOneAndUpdate(
      {
        _id: requestId,
        status: { $in: ["pending", "assigned"] },
        assignedTo: null,
      },
      {
        status: "accepted",
        assignedTo: executiveId,
        acceptedAt: new Date(),
      },
      { new: true }
    );

    if (!request) {
      return res.status(409).json({
        message: "Request already accepted by another executive",
      });
    }

    res.json({
      message: "Request accepted successfully",
      request,
    });
  } catch (err) {
    console.error("Accept request error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get active request for map screen
router.get("/request/active", async (req, res) => {
  try {
    const { executiveId } = req.query;

    if (!executiveId) {
      return res.status(400).json({ message: "executiveId required" });
    }

    const activeRequest = await VerificationRequest.findOne({
      assignedTo: executiveId,
      status: { $in: ["accepted", "in_progress"] },
    })
    .sort({ acceptedAt: -1 }); //MOST RECENT ACCEPTED

    if (!activeRequest) {
      return res.json({ message: "No active request", request: null });
    }

    res.json({
      request: {
        requestId: activeRequest._id,
        user: activeRequest.user,
        verificationType: activeRequest.verificationType,
        location: activeRequest.location,
        status: activeRequest.status,
        acceptedAt: activeRequest.acceptedAt,
      },
    });
  } catch (err) {
    console.error("Active request fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark request as reached (executive reached location)

router.post("/request/reached", async (req, res) => {
  try {
    console.log("REACHED BODY 👉", req.body);
    const { requestId, executiveId } = req.body;

    if (!requestId || !executiveId) {
      return res.status(400).json({ message: "requestId and executiveId required" });
    }

    const existing = await VerificationRequest.findById(requestId);
    console.log("DB REQUEST 👉", {
      id: existing?._id,
      assignedTo: existing?.assignedTo,
      status: existing?.status,
    });

    const request = await VerificationRequest.findOneAndUpdate(
      {
        _id: requestId,
        assignedTo: executiveId, 
        status: "accepted",
      },
      {
        status: "in_progress",
        reachedAt: new Date(),
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found or invalid state" });
    }

    res.json({ message: "Reached location", request });
  } catch (err) {
    console.error("Reached error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete verification
router.post("/request/complete", async (req, res) => {
  try {
    const { requestId, executiveId, result, details} = req.body;

    if (!requestId || !executiveId || !result || !details) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const request = await VerificationRequest.findOneAndUpdate(
      {
        _id: requestId,
        assignedTo: executiveId,
        status: { $in: ["in_progress", "accepted"] },
      },
      {
        status: result === "verified" ? "completed" : "failed",
        verificationResult: {
          result,
          details,
          verifiedAt: new Date(),
      },
    },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found or invalid state" });
    }

    res.json({ message: "Verification completed", request });
  } catch (err) {
    console.error("Complete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// form data to be stored in db
router.post("/request/form", async (req, res) => {
  try {
    const { requestId, executiveId, verificationForm } = req.body;

    if (!requestId || !executiveId || !verificationForm) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const request = await VerificationRequest.findOneAndUpdate(
      {
        _id: requestId,
        assignedTo: executiveId,
        status: "in_progress", 
      },
      {
        $set: {
          verificationForm,
          formSubmittedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found or invalid state" });
    }

    res.json({ message: "Form data saved", request });
  } catch (err) {
    console.error("Form save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// for available requests
router.get("/Request/available", async (req, res) => {
  try {
    const requests = await VerificationRequest.find({ status: "pending" });

    res.json({ requests });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching requests" });
  }
});

// decline request
router.post("/request/decline", async (req,res)=>{
 const { requestId, executiveId } = req.body;

 await VerificationRequest.findByIdAndUpdate(requestId,{
   $addToSet:{ skippedExecutives: executiveId }
 });

 res.json({ message:"Declined" });
});

module.exports = router;
