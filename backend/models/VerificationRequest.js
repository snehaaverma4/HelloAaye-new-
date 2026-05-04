const mongoose = require("mongoose");

const verificationRequestSchema = new mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      addressText: { type: String, required: true },
    },

    verificationType: {
      type: String,
      enum: ["residence", "office"],
      required: true,
    },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    status: {
      type: String,
      enum: [
        "pending",        // waiting to be assigned
        "assigned",       // sent to executive (soft lock)
        "accepted",       // executive accepted
        "in_progress",    // on the way
        "completed",      // verification done
        "cancelled",      // admin/executive cancelled
      ],
      default: "pending",
    },

    assignedTo: {
      type: String,
      ref: "Executive",
      default: null,
    },

    skippedExecutives: [
      {
        type: [String],
        ref: "Executive",
      },
    ],

    assignmentExpiresAt: {
      type: Date,
      default: null,
    },

    createdByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    acceptedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "VerificationRequest",
  verificationRequestSchema
);
