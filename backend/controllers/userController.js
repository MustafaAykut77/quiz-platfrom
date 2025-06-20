import UserModel from "../models/user.js";

export const getUser = async (req, res) => {
	try {
		const user = await UserModel.findOne({ uid: req.user.uid });
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
		const newUser = new UserModel(req.body);
		newUser.uid = req.user.uid;
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
