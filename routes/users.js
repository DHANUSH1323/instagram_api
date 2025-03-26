const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.put('/:id/follow', auth, async (req, res) => {
    try{
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) return res.status(404).json({message: "User not found"});
        if(userToFollow._id.equals(currentUser.id)){
            return  res.status(400).json({message: "You can't follow yourself"});
        }
        
        if(userToFollow.followers.includes(req.user.id)){
            return res.status(400).json({message: "Already following this user"});
        }

        userToFollow.followers.push(req.user.id);
        currentUser.following.push(userToFollow._id);

        await userToFollow.save();
        await currentUser.save();
        res.status(200).json({message: `Now following ${userToFollow.name}`});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.put('/:id/unfollow', auth ,async(req, res) => {
    try{
        const userToUnFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if(!userToUnFollow) return res.status(404).json({message: "User not found"});
        if (userToUnFollow._id.equals(currentUser._id)){
            return res.status(400).json({message: "You can't unfollow yourself"});
        }

        if(!userToUnFollow.followers.includes(req.user.id)){
            return res.status(400).json({message: "You're not following this user"});
        }

        userToUnFollow.followers = userToUnFollow.followers.filter(
            id => id.toString() !== req.user.id
        );

        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userToUnFollow._id.toString()
        );

        await userToUnFollow.save();
        await currentUser.save();

        res.status(200).json({message: `Unfollowed ${userToUnFollow.name}`});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/:id/followers', auth, async(req,res) => {
    try{
        const user = await User.findById(req.params.id).populate('followers', 'name email');
        if(!user) return res.status(404).json({message: "User not found"});

        res.status(200).json(user.followers);
    }catch(err){
        res.status(500).json({message: err.message});
    }

});

router.get('/:id/following', auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('following', 'name email');
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json(user.following);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });