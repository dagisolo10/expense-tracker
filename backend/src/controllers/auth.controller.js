const jwt = require("jsonwebtoken");
const ENV = require("../config/env");
const redis = require("../config/redis");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { generateToken, setCookies, storeRefreshToken } = require("../utils/generateToken");

exports.signup = asyncHandler(async (req, res) => {
    const { fullName, email, password: newPassword } = req.body;

    const user = await User.create({ fullName, email, password: newPassword });
    const { password, ...userObj } = user.toObject();

    const { accessToken, refreshToken } = generateToken(user._id);
    setCookies(res, accessToken, refreshToken);
    await storeRefreshToken(user._id, refreshToken);

    res.status(201).json({ user: userObj });
});

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: "Incorrect credentials" });

    const userWOP = await User.findOne({ email }).select("-password");

    const { accessToken, refreshToken } = generateToken(user._id);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ user: userWOP });
};
exports.logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN);
        await redis.del(`refresh-token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully!" });
});

exports.refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN);
    const storedToken = await redis.get(`refresh-token:${decoded.userId}`);

    if (refreshToken !== storedToken) return res.status(401).json({ message: "Invalid refresh token provided" });

    const accessToken = jwt.sign({ userId: decoded.userId }, ENV.ACCESS_TOKEN, { expiresIn: "15m" });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
});

exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    // Error check
    if (!user) return res.status(404).json({ message: "User not found" });
    // Response
    res.status(200).json(user);
});
