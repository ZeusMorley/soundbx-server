"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const spotifyService_1 = require("../services/spotifyService");
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
            artists: item.track.artists.map((artist) => artist.name),
        }));
        res.json({
            playlistId,
            playlistName: playlist.items[0].track.name,
            trackCount: playlist.items.length,
            tracks,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error getting playlist:', error);
        res.status(500).json({
            error: 'Failed to fetch playlist',
            message: error.message
        });
    }
});
exports.default = router;
