"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyController = void 0;
const spotifyService_1 = require("../services/spotifyService");
class SpotifyController {
    static async getAccessToken(req, res) {
        try {
            const accessToken = await spotifyService_1.SpotifyService.getAccessToken();
            res.json({
                success: true,
                access_token: accessToken,
                token_type: 'Bearer',
                expires_in: 3600
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to get access token'
            });
        }
    }
}
exports.SpotifyController = SpotifyController;
