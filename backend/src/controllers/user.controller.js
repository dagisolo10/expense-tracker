const asyncHandler = require("express-async-handler")
const User = require("../models/user.model")
const cloudinary = require("../config/cloudinary")

exports.updateProfile = asyncHandler(async(req, res) =>{
    const { fullName, email, currPassword, newPassword, profilePic } = req.body
    const userId = req.user._id

    const user = await User.findById(userId)

    if(!user) return res.status(404).json({message: "User not found"})

    if(profilePic) {
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        user.profilePic = uploadResponse.secure_url
    }

    if(newPassword) {
        const correct = await user.matchPassword(currPassword)
        if(!correct) return res.status(400).json({message: "Incorrect password"});
        user.password = newPassword;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    await user.save({ validateModifiedOnly: true })

    res.status(200).json({_id: user._id,fullName: user.fullName,email: user.email,profilePic: user.profilePic})
})

exports.terminateAccount = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const user = await User.findByIdAndDelete(userId)

    if(!user) return res.status(404).json({message: "User not found"});

    res.status(200).json({message: "Account Terminated"})
})