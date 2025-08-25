export function generateCSV(tracks: { name: string; artists: string[] }[]): string {
    const headers = 'title,artist\n';
    const rows = tracks.map(track => {
        const title = `"${track.name.replace(/"/g, '""')}"`;
        const artist = `"${track.artists[0]?.replace(/"/g, '""') || ''}"`; //first artist only para clean
        return `${title},${artist}`;
    }).join('\n');
    
    return headers + rows;
}