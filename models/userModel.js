import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: String,
    coverPicture: String,
    about: String,
    address: String,
    worksAt: String,
    relationship: String,
    followers: Array,
    following: Array,
    country: String
  },
  {
    timestamps: true
  }
);
const UserModel = mongoose.model('Users', UserSchema);
export default UserModel;