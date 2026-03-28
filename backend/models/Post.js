const mongoose  = require("mongoose")

const postSchema = new mongoose.Schema({
    text:{
        type:String,
        trim:true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    analysisType: {
        type: String,
        enum: ["fake_news", "ai_text", "sms", "image"],
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            value: {
                type: Number,
                enum: [1, -1],
                required: false
            }
        }
    ],
    mlChecked: {
        type: Boolean,
        default: false
    },
    mlCheckedAt: {
        type: Date
    },
    mlResult: {
        model: { type: String },
        verdict: { type: String },
        confidence: { type: Number },
        metadata: { type: mongoose.Schema.Types.Mixed }
    }


},{timestamps:true})

module.exports = mongoose.model("Post",postSchema)