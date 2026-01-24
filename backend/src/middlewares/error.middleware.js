const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    let error = err;

    // CastError – invalid ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found with id: ${err.value}`;
        error = new Error(message);
        error.statusCode = 404;
    }

    // Duplicate key
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new Error(message);
        error.statusCode = 400;
    }

    // JWT invalid
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token";
        error = new Error(message);
        error.statusCode = 401;
    }

    // JWT expired
    if (err.name === "TokenExpiredError") {
        const message = "Token expired";
        error = new Error(message);
        error.statusCode = 401;
    }

    // ValidationError – show only your custom messages
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new Error(message.join(", "));
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};

module.exports = errorMiddleware;
