import mongoose from "mongoose";
const { Schema, model } =  mongoose;

/* Creating a new schema for the user model. */
const userSchema = new Schema({
    name: String,
    avatar: [{
        name: String,
		thumbUrl: String,
		status: String,
    }],
    accountDetails: {
        age: Number,
        description: String,
        location: String,
        gender: String,
    },
    username: String,
    id: String,
    email: String,
    password: String,
    googleId: String,
    dateCreated: String,
});

export default model('user', userSchema);
