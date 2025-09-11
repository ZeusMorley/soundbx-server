import { Router } from 'express';
import axios from 'axios';
const router = Router();

router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'SoundBX Server is running!'
    });
});

router.get('/network-test', async (req, res) => {
    try {
      const response = await axios.get('https://httpbin.org/ip');
      res.json({ 
        status: 'OK', 
        message: 'Outbound networking works!' 
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'ERROR', 
        message: 'Outbound networking failed',
      });
    }
  });

export default router;
