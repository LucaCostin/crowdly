import mongoose from 'mongoose';

import PostModel from '../models/post.js';

/**
 * It takes the request body, creates a new post object, and saves it to the database.
 */
export const createPost = async(req, res) => {
	const post = req.body;
	console.log(req.userId)
	const newPost = new PostModel({
		...post,
		user: req.userId,
		username: req.username,
		avatar: req.avatar,
		datePosted: new Date().toISOString(),
	})

	try{
		await newPost.save();
		res.status(201).json(newPost);
	}catch(err) {
		res.status(404).json({ message: 'Oops, looks like something went wrong' })
	};
};

/**
 * It gets the page number from the query string, then uses that to calculate the start index, limit,
 * and total number of posts. 
 * 
 * Then it uses those values to query the database and return the posts. 
 * 
 * The posts are returned in a JSON object that contains the posts, the current page, the total number
 * of posts, and the total number of pages. 
 * 
 * The total number of pages is calculated by dividing the total number of posts by the limit. 
 * 
 * The limit is the number of posts that will be returned per page. 
 * 
 * The start index is the index of the first post that will be returned. 
 * 
 * The start index is calculated by multiplying the page number by the limit. 
 * 
 * For example, if the page number is 2 and the limit is 5, the start index will be 5. 
 * 
 * @param req - the request object
 * @param res - the response object
 */
export const getPosts = async(req, res) => {
	const { page } = req.query;
	try {
		const limit = 5;
		const startIndex = (Number(page) - 1) * limit;
		const total = await PostModel.countDocuments({});
		const posts = await PostModel.find().sort({datePosted: -1}).limit(limit).skip(startIndex);
		res.status(200).json({
			data: posts,
			currPage: Number(page),
			totalPosts: total,
			numberOfPages: Math.ceil(total / limit),
		}); 
	}catch(err) {
		res.status(404).json({ message: 'Oops, looks like something went wrong' })
	};
};

/**
 * It's a function that takes in a request and a response object, and returns a post object from the
 * database.
 */
export const getPost = async(req, res) => {
	// get id from url
	const { id } = req.params;
	try {
		const post = await PostModel.findById(id);
		res.status(200).json(post);
	}catch(err) {
		res.status(404).json({ message: 'Oops, looks like something went wrong' });
	};
};

/**
 * It gets all the posts created by a user.
 */
export const getPostsByUser = async(req, res) => {
	const { username } = req.params;
	if(!username) {
		return res.status(404).json({ message: 'User not registered!'});
	}
	try {
		const userPosts = await PostModel.find({username: username}).sort({datePosted: -1});
		res.status(200).json(userPosts);
	}catch(err) {
		res.status(404).json({ message: 'Oops, looks like something went wrong' });
	};
};

/**
 * It deletes a post from the database if the userId of the post matches the userId of the user who is
 * logged in.
 */
export const deletePost = async (req, res) => {
	const { id } = req.params;
	const userId = req.userId;
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No post exists with id: ${id}` });
          }
		const post = await PostModel.findById(id);
		if(post.user.toString() === userId.toString()) {
			await post.delete();
			res.status(200).json({message: 'Post deleted!'})
		}else return;
	}catch(err) {
		res.status(404).json({ message: 'Oops, looks like something went wrong' });
	}
};

/**
 * It takes the id of the post, the userId of the user who is logged in, the name, contains and
 * imageList of the post and updates the post with the new data.
 */
export const editPost = async (req, res ) => {
	const { id } = req.params;
	const userId = req.userId;
	const { contains, name,  imageList} = req.body
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No post exists with id: ${id}` });
        };
		const post = await PostModel.findById(id);
		if(post.user.toString() === userId.toString()) {
			post.name = name;
			post.contains = contains;
			post.imageList = imageList;
			await post.save()
			res.json(post)
		}
	}catch(err) {
		res.status(404).json({ message: 'Oops, looks like something went wrong' });
	}
};

/**
 * It's a function that allows a user to like a post.
 * @param req - {
 * @param res - response
 * @returns The post object with the updated likes array.
 */
export const likePost = async (req, res) => {
	const { id } = req.params;
	const userId = req.userId;
	const name = req.name;
	if(!userId) {
		return res.json({ message: 'User is not authenticated' });
	}
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No post exists with id: ${id}` });
        };
		const post = await PostModel.findById(id);
		if (post.likes.find(like => like.user.toString() === userId.toString())) {
			post.likes = post.likes.filter(like => like.user.toString() !== userId.toString());
		}else {
			post.likes.push({
				name: name,
				dateLiked: new Date().toISOString(),
				user: userId,
			});
		};
		post.save();
		res.status(200).json(post);

	}catch(err) {
		res.status(404).json({ message: 'Oops, looks like something went wrong' });
	};
};
