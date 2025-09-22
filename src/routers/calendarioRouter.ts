import { Router } from 'express';
import calendarioController from '../controllers/calendarioController';

const router = Router();

router.post('/create-evento', calendarioController.createEvento);
router.get('/get-eventos', calendarioController.getEventos);
router.put('/update-evento/:id', calendarioController.updateEvento);
router.delete('/delete-evento/:id', calendarioController.deleteEvento);

export default router;