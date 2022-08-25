import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api'

/* Creating a thunk that will be used to create a post. */
export const createPost = createAsyncThunk('post/createPost',
	async({ updatedFormData }, { rejectWithValue }) => {
	try{
		const res = await api.createPost(updatedFormData);
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
})

/* Creating a thunk that will be used to get all posts. */
export const getPosts = createAsyncThunk('post/getPosts',
	async(currPage, {rejectWithValue}) => {
	try{
		const res = await api.getPosts(currPage);
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
});

/* This is a thunk that is used to get a single post. */
export const getPost = createAsyncThunk('post/getPost',
	async(id, {rejectWithValue}) => {
	try{
		const res = await api.getPost(id);
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
});

/* This is a thunk that is used to create a comment. */
export const createComment = createAsyncThunk('post/createComment',
	async({id, comment}, {rejectWithValue}) => {
	try{
		const res = await api.createComment(id, comment);
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
});

/* This is a thunk that is used to get all posts by a user. */
export const getPostsByUser = createAsyncThunk('post/getPostsByUser',
	async(username, {rejectWithValue}) => {
	try{
		const res = await api.getPostsByUser(username);
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
});

/* This is a thunk that is used to delete a post. */
export const deletePost = createAsyncThunk('post/deletePost',
	async({ postId, toast }, {rejectWithValue}) => {
	try{
		const res = await api.deletePost(postId);
		toast.success("Post deleted!");
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
});

/* This is a thunk that is used to edit a post. */
export const editPost = createAsyncThunk('post/editPost',
	async({ updatedPost, postId, toast }, {rejectWithValue}) => {
	try{
		const res = await api.editPost(updatedPost, postId);
		toast.success("Post updated!");
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
});

/* This is a thunk that is used to like a post. */
export const likePost = createAsyncThunk('post/likePost',
	async({ postId }, {rejectWithValue}) => {
	try{
		const res = await api.likePost(postId);
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
});

const initialState = {
    post: {},
    posts: [],
    userPosts: [],
	currPage: 1,
	numOfPages: null,
	totalPosts: null,
    error: '',
    loading: false,
};

const emptyPost = {};
const emptyList = [];

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setCurrentPage: (state, action) => {
			state.currPage = action.payload;
		},
		cleanPost: (state, action) => {
			state.post = emptyPost;
		},
		cleanUserPosts: (state, action) => {
			state.userPosts = emptyList;
		}
	},
	extraReducers: {
		[createPost.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
	/* Setting the state of the posts to the payload of the action. */
    	[createPost.fulfilled]: (state, action) => {
			state.loading = false;
			state.post = action.payload;
			state.posts.unshift(action.payload);
		},
		/* If rejected get error message from user controller */
		[createPost.rejected] : (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[getPosts.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
	/* Updating the state of the posts. Create an array that accepts unique elements because payload
	will be added every time component renders*/
		[getPosts.fulfilled]: (state, action) => {
			state.loading = false;
			let posts = [...state.posts, ...action.payload.data];
			let uniqueObjArray = [
				...new Map(posts.map((item) => [item["_id"], item])).values(),
			];
			state.posts = uniqueObjArray;
			state.numOfPages = action.payload.numberOfPages;
			state.totalPosts = action.payload.totalPosts;
		},
		[getPosts.rejected] : (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[getPost.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
		[getPost.fulfilled]: (state, action) => {
			state.post = action.payload;
			state.loading = false;
		},
		[getPost.rejected] : (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[createComment.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
		[createComment.fulfilled]: (state, action) => {
			state.loading = false;
			state.post = action.payload;
		},
		[createComment.rejected] : (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[getPostsByUser.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
		[getPostsByUser.fulfilled]: (state, action) => {
			state.loading = false;
			state.userPosts = action.payload;
		},
		[getPostsByUser.rejected] : (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[deletePost.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
	/* Filtering the posts from the state to update */
		[deletePost.fulfilled]: (state, action) => {
			state.loading = false;
			const {
				arg: {postId},
				} = action.meta
			if(postId) {
				state.userPosts = state.userPosts.filter(post => post._id !== postId);
				state.posts = state.posts.filter(post => post._id !== postId);
			}
		},
		[deletePost.rejected] : (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[editPost.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},

	/* Updating the state of the posts. */
		[editPost.fulfilled]: (state, action) => {
			state.loading = false;
			const {
				arg: {postId},
				} = action.meta
			if(postId) {
				state.userPosts = state.userPosts.map(post => post._id === postId? action.payload : post);
				state.posts = state.posts.map(post => post._id === postId? action.payload : post);
				state.post = action.payload;
			}
		},
		[editPost.rejected] : (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[likePost.pending]: (state, action) => {},
		[likePost.fulfilled]: (state, action) => {
			state.loading = false;
			const {
				arg: {postId},
				} = action.meta
			if(postId) {
				state.userPosts = state.userPosts.map(post => post._id === postId? action.payload : post);
				state.posts = state.posts.map(post => post._id === postId? action.payload : post);
				state.post = action.payload;
			}
		},
		[likePost.rejected] : (state, action) => {
			state.error = action.payload.message;
		},
	}
})

export const { setCurrentPage, cleanPost, cleanUserPosts } = postSlice.actions;
export default postSlice.reducer;
