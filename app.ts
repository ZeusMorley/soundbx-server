import * as dotenv from 'dotenv';
import { SpotifyService } from './src/services/spotifyService';

dotenv.config();

async function main() {
  try {
    const accessToken = await SpotifyService.getAccessToken();
    console.log('Spotify Access Token:', accessToken);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();