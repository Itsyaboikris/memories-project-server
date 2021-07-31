import express from 'express';
import {getPostsBySearch, getPosts, commentPost, getPost, createPosts, updatePost, deletePost, likePost} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', auth, createPosts);
router.patch('/:id', auth, updatePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);
router.delete('/:id', auth, deletePost);

export default router;
