import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

//get a user

export const getUser = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json('User does not exist');
  }
  try {
    const user = await UserModel.findById(id)
    const { password, ...other } = user._doc
    res.status(200).json(other);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//update user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserAdminStatus, password } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json('User does not exist');
  }
  try {
    if (id || currentUserAdminStatus) {
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(password, salt);

      }
      console.log(id, req.body);

      const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
      console.log(user);
      res.status(200).json(user);
    }

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}
// delete user 
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;
  if (currentUserId == id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json('User deleted successfully');
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}

//follow a user 
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId } = req.body;
  if (currentUserId === id) {
    res.status(403).json('Action forbidden')
  } else {
    try {
      const followUser = await UserModel.findById(id);
      console.log('dsds', followUser.followUsers);
      const followingUser = await UserModel.findById(currentUserId)
      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json('User Followed!');
      } else {
        res.status(403).json('User is already followed!');
      }
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}

//unfollow a user 

export const UnFollowUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId } = req.body;
  if (currentUserId === id) {
    res.status(403).json('Action forbidden')
  } else {
    try {
      const followUser = await UserModel.findById(id);
      console.log('dsds', followUser.followUsers);
      const followingUser = await UserModel.findById(currentUserId)
      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json('User UnFollowed!');
      } else {
        res.status(403).json('User is not  followed!');
      }
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}