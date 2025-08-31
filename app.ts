import express from 'express';
import * as dotenv from 'dotenv';
import { SpotifyService, PlaylistService } from './src/services/spotifyService';
import { isValidPlaylistId } from './src/utils/validation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'SoundBX Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/playlist/:id', async (req, res) => {
  try {
    const playlistId = req.params.id;
    
    // Validate playlist ID
    if (!isValidPlaylistId(playlistId)) {
      return res.status(400).json({ 
        error: 'Invalid playlist ID format. Must be 22 alphanumeric characters.',
        timestamp: new Date().toISOString()
      });
    }

    // Get Spotify access token
    const accessToken = await SpotifyService.getAccessToken();
    
    // Fetch playlist data
    const playlist = await PlaylistService.getPlaylist(playlistId, accessToken);
    
    const tracks = playlist.items.map((item: any) => ({
      name: item.track.name,
      artists: item.track.artists.map((artist: any) => artist.name)
    }));

    res.json({
      playlistId,
      trackCount: tracks.length,
      tracks,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error fetching playlist:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Spotify authentication failed. Please check your credentials.',
        timestamp: new Date().toISOString()
      });
    }
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'Playlist not found or not accessible.',
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({ 
      error: 'Internal server error while fetching playlist.',
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});