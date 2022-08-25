import mongoose from 'mongoose';

import PostModel from '../models/post.js';

/**
 * It takes the comment from the request body and adds it to the comments array of the post with the id
 * that matches the id in the request params.
 */
export const createComment = async(req, res) => {
    const { id } = req.params;
	const comment = req.body;
    const userId = req.userId;
    console.log(req.avatar)
	try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No post exists with id: ${id}` });
        };
        const post = await PostModel.findById(id);
        post.comments.push({
            ...comment,
            avatar: req.avatar,
            user: userId,
            datePosted: new Date().toISOString(),
        })
		await post.save();
		res.status(201).json(post);
	}catch(err) {
		res.status(404).json({ message: 'Oops, looks like something went wrong' })
	};
};
