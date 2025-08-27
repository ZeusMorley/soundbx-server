import * as fs from 'fs';
import { YoutubeSearch } from '../src/services/youtubeService';

interface PlaylistRow {
    title: string;
    artist: string;
}

interface WithLink extends PlaylistRow {
    videoId: string;
}

async function addLink() {
    try{
        const csvContent = fs.readFileSync('playlist.csv', 'utf-8');
        const lines = csvContent.split('\n').filter(line => line.trim());

        const header = lines[0];
        const dataLines = lines.slice(1);

        console.log(`Processing ${dataLines.length} tracks...`);

        const withLink: WithLink[] = [];

        for (let i = 0; i<dataLines.length; i++) {
            const line = dataLines[i];
            const [rawTitle, rawArtist] = parseCsvLine(line);

            const title = rawTitle.replace(/^"|"$/g, '');
            const artist = rawArtist.replace(/^"|"$/g, '');

            console.log(`Processing ${i+1} of ${dataLines.length}: ${title} - ${artist}`);

            const result = await YoutubeSearch.search(title, artist);

            if (result) {
                withLink.push({
                    title: rawTitle,
                    artist: rawArtist,
                    videoId: result.videoId
                });
                console.log(`Found link for ${title} - ${artist}`);
            } else {
                withLink.push({
                    title: rawTitle,
                    artist: rawArtist,
                    videoId: ''
                });
                console.log(`No link found for ${title} - ${artist}`);
            }

            if (i < dataLines.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        const withLinkCsv = [
            'title,artist,videoId',
            ...withLink.map(row => `${row.title},${row.artist},${row.videoId}`)
        ].join('\n');

        fs.writeFileSync('withLink.csv', withLinkCsv);
        console.log('With links saved to withLink.csv');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

function parseCsvLine(line: string): [string, string] {
    if (line.startsWith('"')) {
        const match = line.match(/^(".*?"),(".*?")$/);
        if (match) return [match[1], match[2]];
    }
    const parts = line.split(',');
    return [parts[0] ?? '', parts[1] ?? ''];
}

addLink();