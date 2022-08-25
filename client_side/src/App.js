import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import "antd/dist/antd.css";

import Home from './routes/home';
import Login from './routes/login';
import Register from './routes/register';
import Profile from './routes/profile';
import AppHeader from './components/appHeader';
import SinglePost from './routes/singlePost';
import { setUser } from './redux/authProvider'
import PrivateRoute from './components/privateRoute';
import NotFound from './routes/notFound';
import UsersSearch from './routes/usersSearch';


function App() {
    const dispatch = useDispatch();
    /* Get user from local storage */
    const user = JSON.parse(localStorage.getItem('profile'));

    /* A hook that is called when the component is mounted. It is used to set the user in the redux store, 
    prevents logout when refreshing page. */
    useEffect(() => {
        dispatch(setUser(user));
    },[])

    return (
    <BrowserRouter>
        <div>
            <AppHeader />
            <ToastContainer />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<PrivateRoute><Login /></PrivateRoute>} />
                <Route path='/register' element={<PrivateRoute><Register /></PrivateRoute>} />
                <Route path='/profile/:username' element={<Profile />} />
                <Route path='/posts/:id' element={<SinglePost />} />
                <Route path='/search' element={<UsersSearch />} />
                <Route path='*' element={<NotFound />}/>
            </Routes>
         </div>
    </BrowserRouter>
    );
}

export default App;
