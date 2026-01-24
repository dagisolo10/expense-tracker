const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount can't be less or equal to zero"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        type: {
            type: String,
            required: [true, "Type is required"],
            validate: {
                validator: (value) => {
                    return value === "income" || value === "expense";
                },
                message: "Value can only be income or expense",
            },
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
