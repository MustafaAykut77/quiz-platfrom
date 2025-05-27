import UserModel from "../models/User.js";

export const getUsers = async (req, res) => {
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