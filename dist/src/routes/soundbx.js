"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const spotifyService_1 = require("../services/spotifyService");
const youtubeService_1 = require("../services/youtubeService");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.get('/:id', async (req, res) => {
    try {
        const playlistId = req.params.id;
        if (!(0, validation_1.isValidPlaylistId)(playlistId)) {
            return res.status(400).json({
                error: 'Invalid playlist ID format'
            });
        }
        const accessToken = await spotifyService_1.SpotifyService.getAccessToken();
        const playlist = await spotifyService_1.PlaylistService.getPlaylist(playlistId, accessToken);
        const tracks = playlist.items.map((item) => ({
            name: item.track.name,
            artists: item.track.artists.map((artist) => artist.name)
        }));
        const withLinks = [];
        for (const track of tracks) {
            const result = await youtubeService_1.YoutubeSearch.search(track.name, track.artists[0]);
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
    }
    catch (error) {
        console.error('Error getting playlist with YouTube links:', error);
        res.status(500).json({
            error: 'Failed to fetch playlist with YouTube links',
            message: error.message
        });
    }
});
exports.default = router;
