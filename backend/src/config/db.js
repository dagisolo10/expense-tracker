const mongoose = require("mongoose");
const ENV = require("./env");

const connectDB = async () => {
    await mongoose
        .connect(ENV.MONGO_URI)
        .then(() => console.log("✅ Connected to MongoDB locally"))
        .catch((err) => {
            console.log("❌ MongoDB connection failed:", err);
            process.exit(1);
        });
};

module.exports = connectDB;
