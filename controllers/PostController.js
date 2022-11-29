import PostModel from "../models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../models/userModel.js";
//create a new post

export const createPost = async (req, res, next) => {
  const newPost = new PostModel(req.body);
  try {
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}
//get a post

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json('Post not found');
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message
    })

  }
}

// update post

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated successfully")
    } else {
      res.status(403).json('Action forbidden');
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

//Delete post

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.delete();
      res.status(200).json('Post deleted successfully')
    } else {
      res.status(403).json('Action forbidden');
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// like/ dislike post 
export const likePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked successfully")
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unliked successfully")
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


//get timeline post
export const getTimeLinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: 'following',
          foreignField: 'userId',
          as: 'followingPosts',
        }
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0
        }
      }
    ])
    res.status(200)
      .json(currentUserPosts.concat(...followingPosts[0].followingPosts))
    // .sort((a, b) => {
    //   return b.createdAt - a.createdAt;
    // });
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}