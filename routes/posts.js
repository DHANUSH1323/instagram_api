const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const router = express.Router();
const upload = multer({ storage }); // Use cloudinary storage


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

module.exports = router;