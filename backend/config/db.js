// const mongoose = require("mongoose");

// function connectDB() {
//   mongoose.connect(process.env.MONGO_URI)
//     .then(function() {
//       console.log("✅ MongoDB connected successfully");
//     })
//     .catch(function(error) {
//       console.log("❌ Database connection failed:", error.message);
//     });
// }

// module.exports = connectDB;

const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      console.log("📦 Connected DB name:", mongoose.connection.name);
    })
    .catch((error) => {
      console.log("❌ Database connection failed:", error.message);
    });
}

module.exports = connectDB;
