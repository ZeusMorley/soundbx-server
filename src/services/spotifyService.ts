import axios from 'axios';
import qs from 'qs';
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
      console.log('Spotify Config Debug:');
      console.log('CLIENT_ID_SPOTIFY exists:', !!process.env.CLIENT_ID_SPOTIFY);
      console.log('CLIENT_SECRET_SPOTIFY exists:', !!process.env.CLIENT_SECRET_SPOTIFY);
      console.log('CLIENT_ID_SPOTIFY length:', process.env.CLIENT_ID_SPOTIFY?.length || 0);
      console.log('CLIENT_SECRET_SPOTIFY length:', process.env.CLIENT_SECRET_SPOTIFY?.length || 0);
      
      // Proper form encoding
      const data = qs.stringify({ grant_type: 'client_credentials' });
      console.log('Request body:', data);
      
      const authHeader = `Basic ${Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64')}`;
      console.log('Auth header length:', authHeader.length);
      
      const response = await axios.post<SpotifyTokenResponse>(AUTH_URL,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authHeader
          }
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error('Error getting Spotify access token:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
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