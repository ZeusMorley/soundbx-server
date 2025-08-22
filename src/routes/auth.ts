import { Router } from 'express';
import { SpotifyController } from '../controllers/spotifyController';

const router = Router();

router.post('/token', SpotifyController.getAccessToken);

export default router;