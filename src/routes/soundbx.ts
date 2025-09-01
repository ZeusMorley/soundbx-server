import {Router} from 'express';
import { SpotifyService, PlaylistService } from '../services/spotifyService';
import { YoutubeSearch } from '../services/youtubeService';
import { isValidPlaylistId } from '../utils/validation';

const router = Router();

interface WithLink {
    title: string;
    artist: string;
    videoId: string;
}

router.get('/:id', async (req, res) => {
    try {
        const playlistId = req.params.id;

        const withLink: WithLink[] = []

        if (!isValidPlaylistId(playlistId)) {
            return res.status(400).json({ 
              error: 'Invalid playlist ID format. Must be 22 alphanumeric characters.',
              timestamp: new Date().toISOString()
            });
        }

        const accessToken = await SpotifyService.getAccessToken();

        const playlist = await PlaylistService.getPlaylist(playlistId, accessToken);

        const tracks = playlist.items.map((item: any) => ({
            name: item.track.name,
            artist: item.track.artists.map((artist: any) => artist.name)
        }));

        for (const track of tracks) {
            const title = track.name;
            const artist = track.artist[0]; // First artist only

            const result = await YoutubeSearch.search(title, artist);

            if (result) {
                withLink.push({
                    title: title,
                    artist: artist,
                    videoId: result.videoId
                });
            } else {
                withLink.push({
                    title: title,
                    artist: artist,
                    videoId: ''
                });
            }
        }

        res.json({
            playlistId,
            count: tracks.length,
            withLink,
            timestamp: new Date().toISOString()
        });


    } catch (error: any) {
        console.error('Error fetching playlist:', error);
        res.status(500).json({
            error: 'Internal server error while fetching playlist.',
            timestamp: new Date().toISOString()
        });
    }
});

export default router;