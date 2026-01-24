const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transaction.model");
const Category = require("../models/category.model");

exports.addTransaction = asyncHandler(async (req, res) => {
    const { amount, description, type, category, icon } = req.body;

    let categoryId = null;
    const existingCategory = await Category.findOne({ name: category, user: req.user._id });

    if (existingCategory) {
        existingCategory.icon = icon || existingCategory.icon;
        await existingCategory.save();
        categoryId = existingCategory._id;
    } else {
        const newCategory = await Category.create({ name: category, icon: icon || "💰", user: req.user._id });
        categoryId = newCategory._id;
    }

    const transaction = await Transaction.create({ amount, description, type, category: categoryId, user: req.user._id });
    const populatedTransaction = await transaction.populate([
        { path: "category", select: "name icon" },
        { path: "user", select: "-password" },
    ]);

    res.status(201).json(populatedTransaction);
});

exports.getAllTransactions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const sixMonthAgo = new Date();
    const limit = parseInt(req.query.limit) || 0;

    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const transactions = await Transaction.find({ user: userId, createdAt: { $gte: sixMonthAgo } })
        .populate("category", "name icon")
        .populate("user", "-password")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    // if (!transactions.length) return res.status(200).json({ message: "No transactions found", transactions });

    res.status(200).json(transactions);
});

exports.getTransaction = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const transaction = await Transaction.findOne({ user: userId, _id: id }).populate("category", "name icon").populate("user", "-password").lean();

    if (!transaction) return res.status(200).json({ message: "No transaction found" });

    res.status(200).json(transaction);
});

exports.deleteTransaction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOneAndDelete({ user: userId, _id: id });
    if (!transaction) return res.status(404).json({ message: "No transaction found" });

    res.status(200).json({ message: "Transaction deleted successfully" });
});

exports.updateTransaction = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;
    const { amount, description, type, category, icon } = req.body;

    const transaction = await Transaction.findOne({ user: userId, _id: id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    if (category) {
        let categoryDoc = await Category.findOne({ name: category, user: req.user._id });

        if (!categoryDoc) categoryDoc = await Category.create({ name: category, icon: icon || "💰", user: req.user._id });

        transaction.category = categoryDoc._id;
    }

    transaction.type = type ?? transaction.type;
    transaction.amount = amount ?? transaction.amount;
    transaction.description = description ?? transaction.description;

    await transaction.save();
    await transaction.populate([
        { path: "category", select: "name icon" },
        { path: "user", select: "-password" },
    ]);

    res.status(201).json(transaction);
});
