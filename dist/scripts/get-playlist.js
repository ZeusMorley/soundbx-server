"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylist = getPlaylist;
const dotenv = __importStar(require("dotenv"));
const spotifyService_1 = require("../src/services/spotifyService");
const get_token_1 = require("./get-token");
const fs = __importStar(require("fs"));
const validation_1 = require("../src/utils/validation");
const csvgenerator_1 = require("../src/utils/csvgenerator");
dotenv.config();
async function getPlaylist(playlistId) {
    try {
        const accessToken = await (0, get_token_1.getToken)(true);
        if (!(0, validation_1.isValidPlaylistId)(playlistId)) {
            console.error('Invalid playlist ID. Make sure the playlist is also public and the ID is correct.');
            process.exit(1);
        }
        // console.log('Getting playlist...');
        const playlist = await spotifyService_1.PlaylistService.getPlaylist(playlistId, accessToken);
        const results = {
            playlistId: playlistId,
            fetchedAt: new Date().toISOString(),
            tracks: playlist.items?.map((item) => {
                const track = item.track;
                return {
                    name: track.name,
                    artists: track.artists.map((artist) => artist.name)
                };
            }) || []
        };
        fs.writeFileSync('results_cache.json', JSON.stringify(results, null, 2));
        // console.log('Results saved to results_cache.json');
        const csvContent = (0, csvgenerator_1.generateCSV)(results.tracks); // csv para clean, 1 line per search
        fs.writeFileSync('playlist.csv', csvContent);
        // console.log('CSV saved to playlist.csv');
    }
    catch (error) {
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
