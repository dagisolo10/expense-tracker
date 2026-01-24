const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transaction.model");
const Category = require("../models/category.model");

exports.getTotalBalance = asyncHandler(async (req, res) => {
    const totalBalance = await Transaction.aggregate([
        { $match: { user: req.user._id } },

        {
            $group: {
                _id: null,
                totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
            },
        },
        { $project: { _id: 0, total: { $subtract: ["$totalIncome", "$totalExpense"] } } },
    ]);

    res.json({ totalBalance: totalBalance[0]?.total || 0 });
});

exports.getTotalIncome = asyncHandler(async (req, res) => {
    const totalIncome = await Transaction.aggregate([
        { $match: { user: req.user._id, type: "income" } },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" },
            },
        },
        {
            $project: {
                _id: 0,
                total: 1,
            },
        },
    ]);

    res.json({ totalIncome: totalIncome[0]?.total || 0 });
});

exports.getTotalExpense = asyncHandler(async (req, res) => {
    const totalExpense = await Transaction.aggregate([
        { $match: { user: req.user._id, type: "expense" } },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" },
            },
        },
        {
            $project: {
                _id: 0,
                total: 1,
            },
        },
    ]);

    res.json({ totalExpense: totalExpense[0]?.total || 0 });
});

exports.getCategoryTotal = asyncHandler(async (req, res) => {
    const categoryTotal = await Transaction.aggregate([
        { $match: { user: req.user._id } },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" },
            },
        },
        { $match: { total: { $gt: 0 } } }, // Only show categories where the user actually spent/earned money
        {
            $lookup: {
                from: "categories", // The collection name in MongoDB, AKA Category, its plural form in the db
                localField: "_id", // The ID from our group stage
                foreignField: "_id", // The ID in the categories collection
                as: "categoryDetail", // Name of the new array field
            },
        },
        // // 1. Flatten the array so categoryDetail is just an object
        { $unwind: "$categoryDetail" },
        // 2. Clean up the keys for the frontend
        {
            $project: {
                _id: 0,
                total: 1,
                name: "$categoryDetail.name",
                icon: "$categoryDetail.icon",
            },
        },
    ]);

    res.json(categoryTotal);
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await Transaction.aggregate([
        { $match: { user: req.user._id } },

        {
            $group: {
                _id: null,
                totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
            },
        },
        {
            $project: {
                _id: 0,
                totalIncome: 1,
                totalExpense: 1,
                totalBalance: { $subtract: ["$totalIncome", "$totalExpense"] },
            },
        },
    ]);

    res.json({ stats: stats[0] || { totalBalance: 0, totalIncome: 0, totalExpense: 0 } });
});
