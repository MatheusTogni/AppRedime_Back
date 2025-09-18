import { Router } from 'express';
import ministrationController from '../controllers/ministrationController';
import ministrationUpload from '../middleware/ministrationUploadMiddleware';

const router = Router();

router.get('/get-ministrations', ministrationController.getMinistrations);
router.post('/create-ministration', ministrationUpload.array('images', 5), ministrationController.createMinistration);
router.get('/get-ministration/:id', ministrationController.getMinistrationById);
router.delete('/delete-ministration/:id', ministrationController.deleteMinistration);
router.get('/download/:id', ministrationController.downloadMinistration);

export default router;
