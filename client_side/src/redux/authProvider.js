import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api'

/* Creating a thunk for the login action. */
export const login = createAsyncThunk('authentification/login',
	async({ formData, navigate, toast }, { rejectWithValue }) => {
	try{
		const res = await api.logIn(formData);
		toast.success('Logged in!');
		navigate('/');
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
})

/* Creating a thunk for the google login action. */
export const googleLogIn = createAsyncThunk('authentification/googleLogIn',
	async({ user, navigate, toast }, { rejectWithValue }) => {
	try{
		const res = await api.googleLogIn(user);
		toast.success('Logged in with Google!');
		navigate('/');
		return res.data;
	} catch(err) {
		return rejectWithValue(err.response.data);
	}
})

/* Creating a thunk for the register action. */
export const register = createAsyncThunk('authentification/register',
	async({ formData, navigate, toast }, { rejectWithValue }) => {
	try{
		const res = await api.signUp(formData);
		toast.success('Account created!');
		navigate('/');
		return res.data;
	}catch(err) {
		return rejectWithValue(err.response.data);
	}
})

const initialState = {
	user: null,
	error: '',
	loading: false,
}

/* Creating a reducer for the state. */
const authSlice = createSlice({
	name: "authentification",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		logOut: (state, action) => {
			state.user = null;
			localStorage.removeItem('profile');
		},
		setUserAvatar: (state, action) => {
			state.user.result.avatar[0] = action.payload;
			localStorage.setItem('profile', JSON.stringify({...state.user}))
		}
	},
	extraReducers: {
		[login.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
		/* Setting the state of the user to the payload of the action. */
		[login.fulfilled]: (state, action) => {
			state.loading = false;
			state.user = action.payload;
			localStorage.setItem('profile', JSON.stringify({...action.payload}));
		},
		/* If rejected get error message from user controller */
		[login.rejected] : (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[register.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
		[register.fulfilled]: (state, action) => {
			state.loading = false;
			state.user = action.payload;
			localStorage.setItem('profile', JSON.stringify({...action.payload}));
		},
		[register.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
		[googleLogIn.pending]: (state, action) => {
			state.loading = true;
			state.error = '';
		},
		[googleLogIn.fulfilled]: (state, action) => {
			state.loading = false;
			state.user = action.payload;
			localStorage.setItem('profile', JSON.stringify({...action.payload}));
		},
		[googleLogIn.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		},
	}
})

export const { setUser, logOut, setUserAvatar } = authSlice.actions;
export default authSlice.reducer;
