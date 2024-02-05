import mongoose from "mongoose";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

class UserControllers {
  //login user
  static async loginUser(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.login(username, password);
      const token = createToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: token,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        message: "Failed to process login request",
        error: error.message,
       });
    }
  }

  //signup user

  static async signupUser(req, res) {
    const {username, password, userRole } = req.body;

    try {
      const newUser = await User.signup(
       
        username,
        password,
        userRole
      );
      const token = createToken(newUser._id);
      
      return res.status(200).json({ 
        success: true,
        message: "user created successfully",
        data: newUser,
        accessToken: token
       });
    } catch (error) {
        if(error.code===11000){
      return res.status(500).json({ 
        success: false,
        message:" username already exists",
        status: 500,
        data: null
      });
    }else{
        res.status(500).json({
            success: false,
            message: error.message || "failed to create new user",
            status: 500,
            data: null
        })

    }
    }
  }

  //get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({});
      if (users.length === 0) {
        return res.status(404).json("there are no available users");
      }
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  //get user by id
  static async getUserById(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json("user not found");
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  //update user by id
  static async updateUserById(req, res) {
    const { id } = req.params;
    const { address, firstName, lastName, username, email, password, phone } =
      req.body;
    const image = req.file;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }

    try {
      let hash = undefined;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(password, salt);
      }
      const updateUser = await User.findOneAndUpdate(
        { _id: id },
        {
          firstName,
          lastName,
          username,
          email,
          password: hash,
          phone,
          userImage: image ? image.path : undefined,
          $push: { addresses: address },
        },
        { new: true }
      );
      if (!updateUser) {
        return res.status(404).json({ error: "No such user" });
      }
      return res.status(200).json({ updateUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  //delete a user

  static async deleteUser(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }
    try {
      const deletedUser = await User.findOneAndDelete({ _id: id });
      if (!deletedUser) {
        return res.status(404).json({ error: "No such user" });
      }
      return res.status(200).json({ deletedUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default UserControllers;
