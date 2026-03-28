const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        userName:{
            type: String,
            required:true,
            trim:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true
        },
        avatar:{
            type:String,
            required:true
        },
        comments:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment"
            }
        ],
        posts:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Post" 
            }
        ],
        token:{
            type:String
        },
        otp:{
            type:Number,
        },
        otpExpires:{
            type:Date
        },
        isVerified:{
            type:Boolean,
            required:true,
            default:false
        },
        karma:{
            type:Number,
            default:0
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("User",userSchema);