const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const router = express.Router();
const upload = multer({ storage }); // Use cloudinary storage

//to add post
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const newPost = new Post({
            user: req.user.id,
            image: req.file.path, // Cloudinary URL
            caption: req.body.caption
        });

        const saved = await newPost.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//to add comments to the posts
router.post('/:id/comment', auth, async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});

        const newComment ={
            user: req.user.id,
            text: req.body.text
        };

        post.comments.unshift(newComment);
        await post.save();

        res.status(201).json(post.comments[0]);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

//to delete the comment in the posts
router.delete('/:postId/comment/:commentId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId); // ✅ This line should work if Post is defined
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        // comment.remove();
        post.comments.pull(comment._id);
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;