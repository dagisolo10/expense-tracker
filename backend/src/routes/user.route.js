const express = require('express');
const { authorize } = require('../middlewares/auth.middleware');
const { updateProfile, terminateAccount } = require('../controllers/user.controller');
const router = express.Router()

router.patch("/update", authorize, updateProfile)
router.delete("/", authorize, terminateAccount)

module.exports = router