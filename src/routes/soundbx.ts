import { Router } from 'express';
import { PlaylistService, SpotifyService } from '../services/spotifyService';
import { YoutubeSearch } from '../services/youtubeService';
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
            artists: item.track.artists.map((artist: any) => artist.name)
        }));

        const withLinks = [];
        for (const track of tracks) {
            const result = await YoutubeSearch.search(track.name, track.artists[0]);
            withLinks.push({
                title: track.name,
                artist: track.artists[0],
                videoId: result?.videoId || '',
                url: result?.videoId || ''
            });
        }

        res.json({
            playlistId,
            playlistName: playlist.items[0].track.name,
            trackCount: playlist.items.length,
            withLinks,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Error getting playlist with YouTube links:', error);
        res.status(500).json({ 
            error: 'Failed to fetch playlist with YouTube links',
            message: error.message 
        });
    }
});

export default router;
