import axios from 'axios';
import { spotifyConfig, AUTH_URL, PLAYLIST_URL } from '../config/spotify';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PlaylistResponse {
  items: {
    track: {
      name: string;
      artists: {
        name: string;
      }[];
    };
  }[];
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

export class PlaylistService {
  static async getPlaylist(playlistId: string, accessToken: string): Promise<PlaylistResponse> {
    try {
      const response = await axios.get<PlaylistResponse>(
        `${PLAYLIST_URL}${playlistId}/tracks?fields=items(track(name,artists(name)))`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting playlist:', error);
      throw new Error('Failed to get playlist');
    }
  }
}