import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const spotifyConfig = {
    get clientId() {
      return process.env.CLIENT_ID_SPOTIFY || "";
    },
    get clientSecret() {
      return process.env.CLIENT_SECRET_SPOTIFY || "";
    }
  };
  

export const AUTH_URL = 'https://accounts.spotify.com/api/token';
export const PLAYLIST_URL = 'https://api.spotify.com/v1/playlists/';
