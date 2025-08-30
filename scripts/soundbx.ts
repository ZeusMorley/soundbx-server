import * as dotenv from 'dotenv';
import { getPlaylist } from './get-playlist';
import { addLink } from './get-links';
import * as fs from 'fs';

dotenv.config();

async function soundbx(playlistId: string) {
    try {
        console.log('Processing playlist ', playlistId);

        console.log('Getting playlist details...');
        await getPlaylist(playlistId);

        console.log('Adding YouTube links...');
        await addLink();

        console.log('Results:');
        console.log('=' .repeat(50));
        
        if (fs.existsSync('withLink.csv')) {
            const csvContent = fs.readFileSync('withLink.csv', 'utf8');
            const lines = csvContent.split('\n').filter(line => line.trim());
            
            console.log(`Found ${lines.length - 1} tracks with YouTube links:\n`);
            
            // Display first few tracks as preview
            lines.slice(1, 6).forEach((line, index) => {
                const [title, artist, videoId] = line.split(',').map(field => field.replace(/^"|"$/g, ''));
                console.log(`${index + 1}. ${title} - ${artist}`);
                console.log(`   YouTube: https://youtube.com/watch?v=${videoId}\n`);
            });
            
            if (lines.length > 6) {
                console.log(`... and ${lines.length - 6} more tracks`);
            }
        } else {
            console.log('withLink.csv not found');
        }

    } catch (error) {
        console.error('Error in SoundBX:', error);
        process.exit(1);
    }
}

const playlistId = process.argv[2];

if (!playlistId) {
    console.error('Usage: npm run soundbx <spotify_playlist_id>');
    console.error('Example: npm run soundbx 37i9dQZF1DXcBWIGoYBM5M');
    process.exit(1);
}

soundbx(playlistId);
