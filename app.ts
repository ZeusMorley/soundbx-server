import * as dotenv from 'dotenv';
import { SpotifyService } from './src/services/spotifyService';
import * as fs from 'fs';

dotenv.config();

const TOKEN_CACHE_FILE = 'token_cache.json';

interface TokenCache {
  token: string;
  expiresAt: number;
}

async function getCachedToken(): Promise<string | null> {
  try {
    if (fs.existsSync(TOKEN_CACHE_FILE)) {
      const cache: TokenCache = JSON.parse(fs.readFileSync(TOKEN_CACHE_FILE, 'utf8'));
      if (Date.now() < cache.expiresAt) {
        const timeLeft = cache.expiresAt - Date.now();
        const minutes = Math.floor(timeLeft / (1000 * 60));
        
        const now = new Date().toLocaleTimeString();
        const expiresAt = new Date(cache.expiresAt).toLocaleTimeString();
        
        console.log(`Using cached token (expires at ${expiresAt}  [~${minutes}m]  remaining)`);
        return cache.token;
      }
    }
  } catch (error) {
    console.log('Cache read error, getting new token');
  }
  return null;
}

async function main() {
  try {
    // Try to use cached token first
    let accessToken = await getCachedToken();
    
    if (!accessToken) {
      console.log('Getting new token from Spotify...');
      accessToken = await SpotifyService.getAccessToken();
      
      // Cache the token (expires in 1 hour)
      const cache: TokenCache = {
        token: accessToken,
        expiresAt: Date.now() + (3600 * 1000) - (5 * 60 * 1000) // 5 minutes earlier
      };
      fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(cache));
      console.log('Token cached for future use');
    }
    
    console.log('Spotify Access Token:', accessToken);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();