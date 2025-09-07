import { Router } from 'express';
import { PlaylistService, SpotifyService } from '../services/spotifyService';
import { isValidPlaylistId } from '../utils/validation';

const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const playlistId = req.params.id;
        
        if (!isValidPlaylistId(playlistId)) {
            return res.status(400).json({ 
                error: 'Invalid playlist ID format' 
            });
        }

        const accessToken = await SpotifyService.getAccessToken();
        const playlist = await PlaylistService.getPlaylist(playlistId, accessToken);
        
        const tracks = playlist.items.map((item: any) => ({
            name: item.track.name,
            artists: item.track.artists.map((artist: any) => artist.name),
        }));

        res.json({
            playlistId,
            playlistName: playlist.items[0].track.name,
            trackCount: playlist.items.length,
            tracks,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Error getting playlist:', error);
        res.status(500).json({ 
            error: 'Failed to fetch playlist',
            message: error.message 
        });
    }
});

export default router;
