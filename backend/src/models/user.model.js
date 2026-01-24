const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: [true, "Full name is required"],
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "Email is required"],
            validate: [
                {
                    validator: (value) => {
                        const emailRegex = /^[\S]+@[\S]+\.[a-zA-Z]{2,}$/;
                        return emailRegex.test(value);
                    },
                    message: "Invalid email format ❌",
                },
                {
                    validator: async (value) => {
                        return !(await User.exists({ email: value }));
                    },
                    message: "Email already in use 🚫",
                },
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            validate: {
                validator: (value) => {
                    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,30}$/;
                    return passwordRegex.test(value);
                },
                message: "Password must be 6-30 chars, include a letter, number, and symbol",
            },
        },
        profilePic: {
            type: String,
            default: "",
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
