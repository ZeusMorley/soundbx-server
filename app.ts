import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Server is running',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
