import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api';

/* Creating a thunk for the searchUser action. */
export const searchUser = createAsyncThunk('user/searchUser',
	async( searchQuery, { rejectWithValue }) => {
	try{
		const res = await api.searchUser(searchQuery);
		return res.data;
	}catch(err) {
		return rejectWithValue(err.response.data);
	};
});

/* Creating a thunk for the getUser action. */
export const getUser = createAsyncThunk('user/getUser',
	async( username, { rejectWithValue }) => {
	try{
		const res = await api.getUser(username);
		return res.data;
	}catch(err) {
		return rejectWithValue(err.response.data);
	};
});

/* Creating a thunk for the editDetails action. */
export const editDetails = createAsyncThunk('user/editDetails',
    async ( {username, details }, { rejectWithValue }) => {
        try{
            const res = await api.editDetails(username, details);
            return res.data;
        }catch(err) {
            return rejectWithValue(err.response.data);
        };
});

const initialState = {
    users: [],
    account: null,
    _loading: false,
    error:'',
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        cleanUsersFound : (state, action) => {
            state.users = [];
        },
    },
    extraReducers: {
        [searchUser.pending]: (state, action) => {
            state._loading = true;
            state.error = '';
        },
        [searchUser.fulfilled]: (state, action) => {
            state._loading = false;
            state.users = action.payload;
        },
        [searchUser.rejected]: (state, action) => {
            state._loading = false;
            state.error = action.payload.message;
        },
        [getUser.pending]: (state, action) => {
            state._loading = true;
            state.error = '';
        },
        [getUser.fulfilled]: (state, action) => {
            state._loading = false;
            state.account = action.payload;
        },
        [getUser.rejected]: (state, action) => {
            state._loading = false;
            state.error = action.payload.message;
        },
        [editDetails.pending]: (state, action) => {
            state._loading = true;
            state.error = '';
        },
        [editDetails.fulfilled]: (state, action) => {
            state._loading = false;
            state.account.user = action.payload;
        },
        [editDetails.rejected]: (state, action) => {
            state._loading = false;
            state.error = action.payload.message;
        },
    }
})

export const { cleanUsersFound } = userSlice.actions;
export default userSlice.reducer;
