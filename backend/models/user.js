import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	uid: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		trim: true,
		minlength: 2,
		maxlength: 50
	},
	img: {
		type: String
	}
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
