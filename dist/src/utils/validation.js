"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPlaylistId = isValidPlaylistId;
function isValidPlaylistId(playlistId) {
    if (!playlistId || playlistId.length !== 22) {
        return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(playlistId)) {
        return false;
    }
    return true;
}
