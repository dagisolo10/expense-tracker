const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const ENV = require("../config/env");

exports.authorize = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        const decoded = jwt.verify(accessToken, ENV.ACCESS_TOKEN);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
