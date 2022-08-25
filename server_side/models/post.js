import mongoose from "mongoose";
const { Schema, model } =  mongoose;

/* Creating a schema for the posts collection. */
const postSchema = new Schema ({
    contains: String,
    datePosted: String,
    imageList: [{
        name: String,
		thumbUrl: String,
		status: String,
    }],
		name: String,
    comments: [{
        name: String,
        contains: String,
        datePosted: String,
        avatar: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    likes: [{
        name: String,
        dateLiked: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
	username: String,
    avatar: String,
})

export default model('posts', postSchema);