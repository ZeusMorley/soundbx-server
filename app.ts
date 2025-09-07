import express from 'express';
import * as dotenv from 'dotenv';
import healthRoutes from './src/routes/health';
import playlistRoutes from './src/routes/playlist';
import soundbxRoutes from './src/routes/soundbx';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', healthRoutes);
app.use('/playlist', playlistRoutes);
app.use('/soundbx', soundbxRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`Playlist: http://localhost:${PORT}/playlist/:id`);
    console.log(`SoundBX: http://localhost:${PORT}/soundbx/:id`);
});
