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
const dotenv = __importStar(require("dotenv"));
const get_playlist_1 = require("./get-playlist");
const get_links_1 = require("./get-links");
const fs = __importStar(require("fs"));
dotenv.config();
async function soundbx(playlistId) {
    try {
        console.log('Processing playlist ', playlistId);
        console.log('Getting playlist details...');
        await (0, get_playlist_1.getPlaylist)(playlistId);
        console.log('Adding YouTube links...');
        await (0, get_links_1.addLink)();
        console.log('Results:');
        console.log('='.repeat(50));
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
        }
        else {
            console.log('withLink.csv not found');
        }
    }
    catch (error) {
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
