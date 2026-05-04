const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/aadhaar");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      req.user.uid + "-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF allowed"), false);
  }
};

const uploadAadhaar = multer({
  storage,
  fileFilter,
});

module.exports = uploadAadhaar;
