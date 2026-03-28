const express = require("express")
const router = express.Router()

const {auth} = require("../middlewares/userMiddleware")

const {createComment , getPostComments} = require("../controllers/commentController")
const {createPost, listPosts, votePost} = require("../controllers/postController")



// Post related Controllers
router.post("/post",auth,createPost)
router.get("/posts", listPosts)
router.post("/vote", auth, votePost)
router.post("/create-comment", auth, createComment);
router.get("/get-comments", getPostComments);




module.exports = router