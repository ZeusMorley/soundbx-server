import axios from 'axios';
import { spotifyConfig, AUTH_URL } from '../config/spotify';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class SpotifyService {
  static async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post<SpotifyTokenResponse>(AUTH_URL, 
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64')}`
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw new Error('Failed to get Spotify access token');
    }
  }
}