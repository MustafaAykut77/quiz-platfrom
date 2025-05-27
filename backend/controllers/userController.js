import UserModel from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const userData = await UserModel.find();
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching users" 
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error fetching user by uid:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching user"
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { uid, username, profileImage } = req.body;
    const newUser = new UserModel({ uid, username, profileImage });
    const savedUser = await newUser.save();
    
    res.status(201).json({
      success: true,
      data: savedUser
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating user" 
    });
  }
};
