const admin = require("firebase-admin");

function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // 🔓 DEV MODE BYPASS
  if (process.env.DEV_MODE === "true") {
    req.user = {
      uid: "dev-user-123",
      phone_number: "+911234567890",
      email: "dev@test.com",
      role: "EXECUTIVE",
    };
    return next();
  }

  // 🔐 PROD MODE (later)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Session expired" });
  }

  const idToken = authHeader.split(" ")[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error("Token verify failed:", error.message);
      return res.status(401).json({ message: "Session expired" });
    });
}

module.exports = verifyFirebaseToken;
