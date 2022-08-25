import axios from 'axios';

const devEnv = process.env.NODE_ENV !== 'production';
const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;

/* Creating a new instance of axios, and setting the baseURL to the server. */
const API = axios.create({baseURL: `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}`});

/* Adding the token to the header of the request. */
API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.authorization = `Bearer ${
            JSON.parse(localStorage.getItem('profile')).token
        }`;
    }
    return req;
});

export const logIn = (formData) => API.post('/users/login', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
export const googleLogIn = (user) => API.post('/users/googleLogIn', user);
export const searchUser = (searchQuery) => API.get(`/users/search?searchQuery=${searchQuery}`);
export const getUser = (username) => API.get(`/users/user/${username}`);
export const editDetails = (username, details) => API.patch(`/users/edit/${username}`, details);

export const createPost = (formData) => API.post('/posts', formData);
export const getPosts = (page) => API.get(`/posts?page=${page}`);
export const getPost = (id) => API.get(`/posts/${id}`);
export const createComment = (id, comment) => API.patch(`/posts/comments/${id}`, comment);
export const getPostsByUser = (username) => API.get(`/posts/userProfile/${username}`)
export const deletePost = (postId) => API.delete(`/posts/${postId}`);
export const editPost = (updatedpost, postId) => API.patch(`/posts/${postId}`, updatedpost);
export const likePost = (postId) => API.patch(`/posts/like/${postId}`);