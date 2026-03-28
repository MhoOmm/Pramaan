const express = require("express")
const router = express.Router()

const {signup,verifyOTP,login,logout,getUserProfile} = require("../controllers/Auth");
const {auth} = require("../middlewares/userMiddleware");

router.post("/signup",signup)
router.post("/login",login)
router.post("/otp-verify",verifyOTP)
router.post("/logout",logout)
router.get("/me", auth, getUserProfile)


module.exports = router