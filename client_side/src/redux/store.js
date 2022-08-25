import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authProvider';
import postReducer from './postProvider';
import userReducer from './userProvider';

const reducer = {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
};

export default configureStore({
    reducer
});
