import * as dotenv from 'dotenv';
import { PlaylistService } from '../src/services/spotifyService';
import { getToken } from './get-token';
import * as fs from 'fs';
import { isValidPlaylistId } from '../src/utils/validation';

dotenv.config();

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

async function getPlaylist(playlistId: string) {
    try {
        const accessToken = await getToken(true);

        if (!isValidPlaylistId(playlistId)) {
            console.error('Invalid playlist ID');
            process.exit(1);
        }

        console.log('Getting playlist...');
        const playlist = await PlaylistService.getPlaylist(playlistId, accessToken);

        const results = {
            playlistId: playlistId,
            fetchedAt: new Date().toISOString(),
            tracks: (playlist as any).items?.map((item: any) => {
                const track = item.track;
                return {
                    name: track.name,
                    artists: track.artists.map((artist: any) => artist.name)
                };
            }) || []
        };

        fs.writeFileSync('results_cache.json', JSON.stringify(results, null, 2));
        console.log('Results saved to results_cache.json');

    } catch (error) {
    console.error('Error: ', error);
    process.exit(1);
   }
}
  
getPlaylist(process.argv[2])