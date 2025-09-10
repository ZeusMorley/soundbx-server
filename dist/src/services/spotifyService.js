"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistService = exports.SpotifyService = void 0;
const axios_1 = __importDefault(require("axios"));
const spotify_1 = require("../config/spotify");
class SpotifyService {
    static async getAccessToken() {
        try {
            const response = await axios_1.default.post(spotify_1.AUTH_URL, 'grant_type=client_credentials', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${spotify_1.spotifyConfig.clientId}:${spotify_1.spotifyConfig.clientSecret}`).toString('base64')}`
                }
            });
            return response.data.access_token;
        }
        catch (error) {
            console.error('Error getting Spotify access token:', error);
            throw new Error('Failed to get Spotify access token');
        }
    }
}
exports.SpotifyService = SpotifyService;
class PlaylistService {
    static async getPlaylist(playlistId, accessToken) {
        try {
            const response = await axios_1.default.get(`${spotify_1.PLAYLIST_URL}${playlistId}/tracks?fields=items(track(name,artists(name)))`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error getting playlist:', error);
            throw new Error('Failed to get playlist');
        }
    }
}
exports.PlaylistService = PlaylistService;
