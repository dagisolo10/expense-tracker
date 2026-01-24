const jwt = require("jsonwebtoken");
const ENV = require("../config/env");
const redis = require("../config/redis");

exports.generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, ENV.ACCESS_TOKEN, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId }, ENV.REFRESH_TOKEN, { expiresIn: "7d" });

    return { accessToken, refreshToken };
};

exports.setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

exports.storeRefreshToken = async (userId, refreshToken) => {
    redis.set(`refresh-token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
};
