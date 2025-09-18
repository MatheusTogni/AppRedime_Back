import { Router } from 'express';
import postsController from '../controllers/postsController';
import upload from '../middleware/uploadMiddleware';

const router = Router();

router.get('/get-posts', postsController.getPosts);
router.post('/create-post', upload.array('images', 10), postsController.createPost);
router.delete('/delete-post/:id', postsController.deletePost);

export default router;
