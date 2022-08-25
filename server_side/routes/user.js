import express from 'express';

import verifyAuth from '../middleware/verifyAuth.js';
import {signUp, logIn, googleLogIn, searchUser, getUser, editDetails} from '../controllers/user.js';

/*Create api routes*/
const router = express.Router();

/* Creating a route for the signup page. */
router.post('/signup', signUp);

router.post('/login', logIn);
router.post('/googleLogIn', googleLogIn);
router.get('/search', searchUser);
router.get('/user/:username', getUser);
router.patch('/edit/:username', verifyAuth, editDetails);

export default router;