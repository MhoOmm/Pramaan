const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")


exports.signup = async(req,res)=>{
    try {
        
        const{
            userName,
            email,
            password,
            confirmPassword,
            avatar
        } = req.body;

        if(!userName || !email || !password || !confirmPassword || !avatar){
            return res.status(403).json({
                success:false,
                message:"All feilds are required"
            })
        }
        
        const existingUsername = await User.findOne({userName});
        if(existingUsername){
            return res.status(400).json({
                success:false,
                message:"This UserName is already taken, use other"
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                "Password and Confirm Password do not match. Please try again.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        

        const hashedPassword = await bcrypt.hash(password,10);

        const otp = Number(otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        );

        const otpExpires = Date.now() + 5 * 60 * 1000;

        const user = await User.create({
            userName,
            email: normalizedEmail,
            password:hashedPassword,
            avatar,
            otp,
            otpExpires
        })

        await mailSender(
            email,
            "Pramaan OTP Verification",
            `Your OTP for account verification is: ${otp}. It will expire in 5 minutes.`
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent to email. Please verify.",
        });   


    } catch (error) {
        return res.status(500).json({
            success:false,
            error,
            message:"User cannot be registered"
        })
    }
}






exports.verifyOTP =  async(req,res) =>{
    try {
        
        const {userName,otp} = req.body;

        const user = await User.findOne({userName});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.otp !== Number(otp)) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        });
    }

    if (!user.otpExpires || user.otpExpires < Date.now()) {
        return res.status(400).json({
            success: false,
            message: "OTP has expired",
        });
    }

    user.otp = null;
    user.otpExpires = null;

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SERVER_KEY,
      {
        expiresIn: "24h",
      }
    );

    user.token = token;
    user.isVerified = true

    await user.save();

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(200).json({
        success: true,
        user,
        message: "login successful",
      });

    } catch (error) {
        return res.status(500).json({
            success:false,
            error,
            message:"otp-verify failed"
        })
    }
}





exports.login = async(req,res) =>{
    try {
        
        const {password,userName} = req.body;

        if(!password || !userName){
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }

        const user = await User.findOne({ userName })

        if (!user) {
        
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Account not verified. Please verify OTP.",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.JWT_SERVER_KEY,
                {
                expiresIn: "24h",
                }
        );

        user.token = token;
        user.password = undefined;
        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options).status(200).json({
            success: true,
            user,
            message: `User Login Success`,
        });
        } else {
        return res.status(401).json({
            success: false,
            message: `Password is incorrect`,
        });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
            message: `Login Failure Please Try Again`,
        });
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
            message: "Logout failed",
        });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.user.id).select("-password -token");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};