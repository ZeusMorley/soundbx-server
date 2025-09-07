import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'SoundBX Server is running!'
    });
});

export default router;
