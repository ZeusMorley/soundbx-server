import * as dotenv from 'dotenv';
import { PlaylistService } from '../src/services/spotifyService';
import { getToken } from './get-token';
import * as fs from 'fs';
import { isValidPlaylistId } from '../src/utils/validation';
import { generateCSV } from '../src/utils/csvgenerator';

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


export async function getPlaylist(playlistId: string): Promise<void> {
    try {
        const accessToken = await getToken(true);

        if (!isValidPlaylistId(playlistId)) {
            console.error('Invalid playlist ID. Make sure the playlist is also public and the ID is correct.');
            process.exit(1);
        }

        // console.log('Getting playlist...');
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
        // console.log('Results saved to results_cache.json');

        const csvContent = generateCSV(results.tracks); // csv para clean, 1 line per search
        fs.writeFileSync('playlist.csv', csvContent);
        // console.log('CSV saved to playlist.csv');

    } catch (error) {
    console.error('Error: ', error);
    process.exit(1);
   }
}

if (require.main === module) { // para dili ma auto call if i import
    const playlistId = process.argv[2];
    if (!playlistId) {
        console.error('Usage: npm run playlist <playlist_id>');
        process.exit(1);
    }
    getPlaylist(playlistId);
}