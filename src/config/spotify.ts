import * as dotenv from 'dotenv';

dotenv.config();

export const spotifyConfig = {
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
}

export const AUTH_URL =  'https://accounts.spotify.com/api/token';
export const PLAYLIST_URL = 'https://api.spotify.com/v1/playlists/';