
const User = require("../models/User")
const Post = require("../models/Post")
const axios = require("axios")

const ML_BASE_URL = process.env.ML_BASE_URL || "http://127.0.0.1:10000";

const runMlCheck = async (post) => {
    const type = post.analysisType;

    if (type === "fake_news") {
        const response = await axios.post(
            `${ML_BASE_URL}/predict-text`,
            { text: post.text },
            { timeout: 60000 }
        );

        return {
            model: "fake_news",
            verdict: response.data.prediction === 1 ? "Real" : "Fake",
            confidence: response.data.confidence,
            metadata: response.data
        };
    }

    if (type === "ai_text") {
        const response = await axios.post(
            `${ML_BASE_URL}/predict-ai-text`,
            { text: post.text },
            { timeout: 60000 }
        );

        return {
            model: "ai_text",
            verdict: response.data.verdict,
            confidence: response.data.confidence,
            metadata: response.data
        };
    }

    if (type === "sms") {
        const response = await axios.post(
            `${ML_BASE_URL}/predict-sms`,
            { text: post.text },
            { timeout: 60000 }
        );

        return {
            model: "sms",
            verdict: response.data.prediction,
            confidence: null,
            metadata: response.data
        };
    }

    if (type === "image") {
        const response = await axios.post(
            `${ML_BASE_URL}/predict-image`,
            { image_url: post.imageUrl },
            { timeout: 60000 }
        );

        return {
            model: "image",
            verdict: response.data.prediction,
            confidence: response.data.confidence,
            metadata: response.data
        };
    }

    return null;
};


//create post
// exports.createPost = async(req,res)=>{
//     try {
//         const { text, imageUrl, analysisType } = req.body;
//         const userId = req.user.id

//         if(!analysisType){
//             return res.status(400).json({
//                 success:false,
//                 message:"analysisType is required"
//             })
//         }

//         const validTypes = ["fake_news", "ai_text", "sms", "image"];
//         if (!validTypes.includes(analysisType)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "invalid analysisType"
//             });
//         }

//         if (analysisType === "image") {
//             if (!imageUrl) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "imageUrl is required for image analysis"
//                 });
//             }
//         } else {
//             if (!text) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "text is required for text analysis"
//                 });
//             }
//         }

//         if(!userId){
//             return res.status(400).json({
//                 success:false,
//                 message:"failed to fetch userId OR login first"
//             })
//         }

//         const post  = await Post.create({
//             text,
//             imageUrl,
//             analysisType,
//             user:userId
//         })

//         await User.findByIdAndUpdate(userId,{$push:{posts:post._id}})

//         return res.status(200).json({
//             success:true,
//             post,
//             message:"post created success"
//         })

//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({
//             success:false,
//             error,
//             message:"unable to create post"
//         })
//     }
// }

exports.createPost = async (req, res) => {
    try {
        const { text, analysisType } = req.body;
        let imageUrl = req.body.imageUrl;
        const userId = req.user.id;

        if (req.files && req.files.image) {
            const { uploadImageToCloudinary } = require("../utils/imageUploader");
            const result = await uploadImageToCloudinary(req.files.image.tempFilePath, "pranaam_posts");
            imageUrl = result.secure_url;
        }

        // Validation (unchanged)
        if (!analysisType) {
            return res.status(400).json({
                success: false,
                message: "analysisType is required"
            });
        }

        const validTypes = ["fake_news", "ai_text", "sms", "image"];
        if (!validTypes.includes(analysisType)) {
            return res.status(400).json({
                success: false,
                message: "invalid analysisType"
            });
        }

        if (analysisType === "image") {
            if (!imageUrl) {
                return res.status(400).json({
                    success: false,
                    message: "An uploaded image or imageUrl is required for image analysis"
                });
            }
        } else {
            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: "text is required for text analysis"
                });
            }
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "failed to fetch userId OR login first"
            });
        }

        // ========== NEW: RUN ML CHECK FIRST ==========
        const mlPostData = {
            text: text?.trim(),
            imageUrl: imageUrl?.trim(),
            analysisType: analysisType
        };

        let mlResult = null;
        try {
            mlResult = await runMlCheck(mlPostData);
            console.log("ML Result:", mlResult);  // Debug log
        } catch (mlError) {
            console.error("ML Check failed:", mlError.message);
            // Don't fail the request - store as unchecked
            mlResult = null;
        }

        // Optional: Skip creating post if NOT fake (uncomment to enforce)
        /*
        if (mlResult && mlResult.model === 'fake_news' && mlResult.verdict !== 'Fake') {
            return res.status(200).json({
                success: true,
                message: "Content passed ML check (Real), post not created",
                mlResult
            });
        }
        */

        // ========== CREATE POST WITH ML RESULTS ==========
        const post = await Post.create({
            text: text?.trim(),
            imageUrl: imageUrl?.trim(),
            analysisType,
            user: userId,
            mlChecked: !!mlResult,  // true if ML ran successfully
            mlCheckedAt: mlResult ? new Date() : undefined,
            mlResult: mlResult || undefined  // Stores full ML response
        });

        // Update user posts
        await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

        return res.status(201).json({  // 201 for created
            success: true,
            post,
            message: "Post created with ML analysis",
            mlSummary: mlResult ? {
                model: mlResult.model,
                verdict: mlResult.verdict,
                confidence: mlResult.confidence
            } : "ML check failed/skipped"
        });

    } catch (error) {
        console.error("CREATE_POST_ERROR:", error);
        return res.status(500).json({
            success:false,
            error: error.message || error.toString(),
            message:"unable to create post: " + (error.message || "")
        })
    }
};


exports.listPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("user", "userName avatar karma");

        return res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
            message: "unable to fetch posts"
        });
    }
};

exports.votePost = async (req, res) => {
    try {
        const { postId, value } = req.body;
        const userId = req.user.id;

        const voteValue = Number(value);

        if (!postId || Number.isNaN(voteValue) || ![1, -1].includes(voteValue)) {
            return res.status(400).json({
                success: false,
                message: "postId and value (1 or -1) are required"
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "post not found"
            });
        }

        if (post.user.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "cannot vote on your own post"
            });
        }

        const existingVote = post.votes.find(
            (vote) => vote.user.toString() === userId
        );

        let karmaChange = 0;

        if (existingVote) {
            if (existingVote.value === voteValue) {
                return res.status(200).json({
                    success: true,
                    post,
                    message: "vote unchanged"
                });
            }

            if (existingVote.value === 1) {
                if (post.upvotes % 3 === 0) karmaChange -= 1;
                post.upvotes -= 1;
            } else {
                post.downvotes -= 1;
            }

            if (voteValue === 1) {
                post.upvotes += 1;
                if (post.upvotes % 3 === 0) karmaChange += 1;
            } else {
                post.downvotes += 1;
            }

            existingVote.value = voteValue;
        } else {
            post.votes.push({ user: userId, value: voteValue });
            if (voteValue === 1) {
                post.upvotes += 1;
                if (post.upvotes % 3 === 0) karmaChange += 1;
            } else {
                post.downvotes += 1;
            }
        }

        const totalVotes = post.upvotes + post.downvotes;
        if (totalVotes > 0) {
            const ratio = post.upvotes / totalVotes;
            if (ratio > 0.5 && !post.mlChecked) {
                try {
                    const mlResult = await runMlCheck(post);
                    if (mlResult) {
                        post.mlResult = mlResult;
                        post.mlChecked = true;
                        post.mlCheckedAt = new Date();
                    }
                } catch (mlError) {
                    console.error("ML Check failed during vote:", mlError.message);
                }
            }
        }

        await post.save();

        if (karmaChange !== 0) {
            await User.findByIdAndUpdate(post.user, { $inc: { karma: karmaChange } });
        }

        await post.populate('user', 'userName avatar karma');

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
            message: "unable to vote"
        });
    }
};

