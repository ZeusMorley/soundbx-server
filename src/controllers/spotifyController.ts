import { Request, Response } from 'express';
import { SpotifyService } from '../services/spotifyService';

export class SpotifyController {
  static async getAccessToken(req: Request, res: Response) {
    try {
      const accessToken = await SpotifyService.getAccessToken();
      
      res.json({
        success: true,
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get access token'
      });
    }
  }
}