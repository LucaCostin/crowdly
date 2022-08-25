import jwt from 'jsonwebtoken';

import UserModel from '../models/user.js';
import { data } from '../sensitive.js';

/**
 * It checks if the user is logged in with email and password or google, then it verifies the token and
 * adds the userId and username to the request object.
 */
const verifyAuth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const isCustomAuth = token.length < 500;
		if(token && isCustomAuth) {
			const user = jwt.verify(token, data.key);
			const email = user.email;
			const _user = await UserModel.findOne({ email });
			req.userId = _user?._id;
			req.username = _user?.username;
			req.name = _user?.name;
			req.avatar = _user?.avatar[0]?.thumbUrl;
		}else {
			const user = jwt.decode(token);
			const googleId = user?.sub.toString();
			const _user = await UserModel.findOne({ googleId });
			req.userId = _user?._id;
			req.username = _user?.username;
			req.name = _user?.name;
			req.avatar = _user?.avatar[0]?.thumbUrl;
		}
		next();
	}catch(err) {
		console.log(err);
	};
};

export default verifyAuth;