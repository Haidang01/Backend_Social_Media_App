import UserModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Register user 

export const registerUser = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);
  const newUser = new UserModel({
    username, password: hashPass, firstname, lastname
  })
  try {
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      return res.status(404).json({ message: 'User already exists' });
    }
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//Login user

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const checkPass = bcrypt.compareSync(password, user.password);
      if (checkPass) {
        const { password, ...other } = user._doc
        const token = jwt.sign(other, process.env.SECRET_KEY, {
          expiresIn: '1h'
        });
        res.status(200).json({ other, token })
      } else {
        res.status(404).json({ message: 'Wrong Password' })
      }
    } else {
      res.status(404).json({ message: 'User does not exist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });

  }

}