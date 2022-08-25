import express from 'express';

import verifyAuth from '../middleware/verifyAuth.js';
import { createPost, getPosts, getPost, getPostsByUser, deletePost, editPost, likePost, } from '../controllers/post.js';
import { createComment } from '../controllers/comment.js';

const router = express.Router();
router.post('/', verifyAuth, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/userProfile/:username', getPostsByUser);

router.delete('/:id', verifyAuth, deletePost);
router.patch('/:id', verifyAuth, editPost);
router.patch('/like/:id', verifyAuth, likePost);
router.patch('/comments/:id', verifyAuth, createComment);

export default router;
