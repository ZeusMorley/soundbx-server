export function isValidPlaylistId(playlistId: string): boolean {
    if (!playlistId || playlistId.length !== 22) {
        return false;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(playlistId)) {
        return false;
    }
    
    return true;
}