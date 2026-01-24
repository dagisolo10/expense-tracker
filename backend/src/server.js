// package imports
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

// local imports
const ENV = require("./config/env");
const connectDB = require("./config/db");

// route imports
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const transactionRoute = require("./routes/transaction.route")
const analyticsRoute = require("./routes/analytics.route");

// middleware import
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// middlewares
app.use(cookieParser());
    app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:5173", ENV.VITE_API_URL], credentials: true }))

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/transactions", transactionRoute);
app.use("/transaction/stats", analyticsRoute);

app.use(errorMiddleware);

// connection
connectDB().then(() => app.listen(ENV.PORT, () => console.log("Server running...")));
