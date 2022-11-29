import express from 'express';
import { createPost, deletePost, getPost, getTimeLinePosts, likePost, updatePost } from '../controllers/PostController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createPost);
router.get('/:id', auth, getPost);
router.put('/:id', auth, updatePost);
router.put('/:id/like', auth, likePost);
router.delete('/:id', auth, deletePost);
router.get('/:id/timeline', auth, getTimeLinePosts);
export default router;