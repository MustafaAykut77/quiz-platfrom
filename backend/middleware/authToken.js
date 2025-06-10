import { auth } from "../config/firebase-config.js"

export const authToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized: No token provided' });
	}

	const idToken = authHeader.split('Bearer ')[1];
	try {
		const decodedTokenUser = await auth.verifyIdToken(idToken);
		req.user = decodedTokenUser;
		next();
	} catch (error) {
		console.error('Error verifying token:', error);
		return res.status(401).json({ message: 'Unauthorized: Invalid token' });
	}
};