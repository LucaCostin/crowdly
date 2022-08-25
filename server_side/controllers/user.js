import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { data } from '../sensitive.js';

import UserModel from "../models/user.js";

/*
* It takes a user object, and returns a token that expires in 5 hours.
*/
function generateToken(_user) {
	return jwt.sign({
			"id": _user.id,
			"email": _user.email,
			"name": _user.name,
	}, data.key, {expiresIn: '5h'});
}


/**
 * It takes in a request object and a response object, and then it tries to find a user with the email
 * that was passed in the request body. If it finds a user, it returns a 400 status code with a message
 * saying that the user already exists. If it doesn't find a user, it hashes the password, creates a username,
 * creates a  new user, generates a token, and returns a 201 status code with the result and the token..
 */
export const signUp = async (req, res) => {
	const { firstName, lastName, email, password} = req.body;

	try {
			const existingUser = await UserModel.findOne({ email });

			if(existingUser){
					return res.status(400).json({message: "User already signed up"})
			}

			const cryptedPassword = await bcrypt.hash(password, 12);

			const _name = `${firstName} ${lastName}`;

			const sameName = await UserModel.find({name: _name});
			const _username = `${firstName}.${lastName}${sameName.length}`.toLowerCase();

			const result = await UserModel.create({
					email,
					name: _name,
					avatar: {
						name:'placeholder.png',
						thumbUrl: data.placeholderImage,
						status: 'done'
					},
					username: _username,
					password: cryptedPassword,
					dateCreated: new Date().toISOString(),
			});

			const token = generateToken(result);
			res.status(201).json({result, token});
	} catch(err) {
			res.status(500).json({message:'Oops, looks like something went wrong!'});
			console.log(err);
	}
}

/**
 * It takes in the email and password from the request body, checks if the email is registered, if it
 * is, it checks if the password matches the one in the database, if it does, it generates a token and
 * sends it back to the client.
 */

export const logIn = async (req, res) => {
	const { email, password } = req.body;

	try {
			const result = await UserModel.findOne({ email });

			if(!result) return res.status(404).json({message:'Email is not registered!'});

			const matchPasswords = await bcrypt.compare(password, result.password);

			if(!matchPasswords) return res.status(400).json({message:'Wrong password!'});

			const token = generateToken(result);
			res.status(200).json({result, token});
	}catch(err) {
			res.status(500).json({ message:'Oops, looks like something went wrong!' });
			console.log(err);
	}
}


/**
 * It checks if the user exists in the database, if it does, it returns the user's data and a token, if
 * it doesn't, it creates a new user and returns the user's data and a token.
 */
export const googleLogIn = async (req, res) => {
	const {email, name, token, googleId, username} = req.body;
	try {
		const existingUser = await UserModel.findOne({ email });
		if(existingUser) {
			const result = { _id: existingUser._id.toString(), email, name, username: existingUser.username, avatar: existingUser.avatar};
			return res.status(200).json({ result, token} );
		}

		const sameName = await UserModel.find({name: name});
		const separatedName = name.split(' ')
		const _username = `${separatedName[0]}.${separatedName[1]}${sameName.length}`.toLowerCase();

		const result = await UserModel.create({
			email,
			name,
			username: _username,
			googleId,
			avatar: {
				name:'placeholder.png',
				thumbUrl: data.placeholderImage,
				status: 'done'
			},
			dateCreated: new Date().toISOString(),
		});
		res.status(200).json({ result, token });
	}catch(err) {
		res.status(500).json({ message:'Oops, looks like something went wrong!' });
	};
};


/**
 * It takes a search query from the client, creates a regular expression from it, and then searches the
 * database for users with a name that matches the regular expression
 */
export const searchUser = async (req, res) => {
	const { searchQuery } = req.query;
	try {
		const name = new RegExp(searchQuery, 'i');
		const users = await UserModel.find({ name });
		res.json(users);
	}catch(err) {
		res.status(500).json({ message:'Oops, looks like something went wrong!' });
	};
};

/**
 * It takes a username from the request params, finds the user in the database, and returns the user to
 * the client.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getUser = async (req, res) => {
	const { username } = req.params;
	try{
		const user = await UserModel.findOne({ username });
		res.status(200).json({ user })
	}catch(err) {
		res.status(500).json({ message:'Oops, looks like something went wrong!' });
	};
};

/**
 * It takes the username from the params, the avatar, age, description, location and gender from the
 * body, and the userId from the token. It then finds the user by the username, and if the userId
 * matches the userId in the token, it updates the user's avatar and accountDetails.
 */
export const editDetails = async (req, res) => {
	const { username } = req.params;
	const { avatar,  age, description, location, gender } = req.body;
	const userId = req.userId;
	try{
		const user = await UserModel.findOne({ username });
		// const posts = await PostModel.find({ user: userId })
		if(user._id.toString() === userId.toString()) {
			user.avatar = avatar[0];
			user.accountDetails = {
				age,
				description,
				location,
				gender
			}
			// posts = posts.map(post => post.avatar = user.avatar[0].thumbUrl);
			// posts = posts.map(post => post.comments.avatar = user.avatar[0].thumbUrl);
			await user.save();
			// await posts.save();
			res.status(200).json(user)
		}
	}catch(err) {
		res.status(500).json({ message:'Oops, looks like something went wrong!' });
	};
};
