import { Hono } from 'hono';
import { noteController } from '../controllers/noteController.js';

const router = new Hono();

router.get('/notes', noteController.getAll);
router.get('/notes/:id', noteController.getOne);
router.post('/notes', noteController.create);
router.put('/notes/:id', noteController.update);
router.delete('/notes/:id', noteController.delete);

export default router;