"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistService = exports.SpotifyService = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const spotify_1 = require("../config/spotify");
class SpotifyService {
    static async getAccessToken() {
        try {
            console.log('Spotify Config Debug:');
            console.log('CLIENT_ID_SPOTIFY exists:', !!process.env.CLIENT_ID_SPOTIFY);
            console.log('CLIENT_SECRET_SPOTIFY exists:', !!process.env.CLIENT_SECRET_SPOTIFY);
            console.log('CLIENT_ID_SPOTIFY length:', process.env.CLIENT_ID_SPOTIFY?.length || 0);
            console.log('CLIENT_SECRET_SPOTIFY length:', process.env.CLIENT_SECRET_SPOTIFY?.length || 0);
            // Proper form encoding
            const data = qs_1.default.stringify({ grant_type: 'client_credentials' });
            console.log('Request body:', data);
            const authHeader = `Basic ${Buffer.from(`${spotify_1.spotifyConfig.clientId}:${spotify_1.spotifyConfig.clientSecret}`).toString('base64')}`;
            console.log('Auth header length:', authHeader.length);
            console.log('Auth header preview:', authHeader.substring(0, 12) + '...');
            const response = await axios_1.default.post(spotify_1.AUTH_URL, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': authHeader
                }
            });
            return response.data.access_token;
        }
        catch (error) {
            console.error('Error getting Spotify access token:', error);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
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
