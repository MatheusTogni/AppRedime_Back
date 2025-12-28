import { Router } from 'express';
import { bibleController } from '../controllers/bibleController';

const router = Router();

router.get('/books', bibleController.getBooks);
router.get('/verses/:version/:book/:chapter', bibleController.getVerses);

export default router;
