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
exports.addLink = addLink;
const fs = __importStar(require("fs"));
const youtubeService_1 = require("../src/services/youtubeService");
async function addLink() {
    try {
        const csvContent = fs.readFileSync('playlist.csv', 'utf-8');
        const lines = csvContent.split('\n').filter(line => line.trim());
        const header = lines[0];
        const dataLines = lines.slice(1);
        // console.log(`Processing ${dataLines.length} tracks...`);
        const withLink = [];
        for (let i = 0; i < dataLines.length; i++) {
            const line = dataLines[i];
            const [rawTitle, rawArtist] = parseCsvLine(line);
            const title = rawTitle.replace(/^"|"$/g, '');
            const artist = rawArtist.replace(/^"|"$/g, '');
            // console.log(`Processing ${i+1} of ${dataLines.length}: ${title} - ${artist}`);
            const result = await youtubeService_1.YoutubeSearch.search(title, artist);
            if (result) {
                withLink.push({
                    title: rawTitle,
                    artist: rawArtist,
                    videoId: result.videoId
                });
                // console.log(`Found link for ${title} - ${artist}`);
            }
            else {
                withLink.push({
                    title: rawTitle,
                    artist: rawArtist,
                    videoId: ''
                });
                // console.log(`No link found for ${title} - ${artist}`);
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
        // console.log('With links saved to withLink.csv');
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
function parseCsvLine(line) {
    if (line.startsWith('"')) {
        const match = line.match(/^(".*?"),(".*?")$/);
        if (match)
            return [match[1], match[2]];
    }
    const parts = line.split(',');
    return [parts[0] ?? '', parts[1] ?? ''];
}
if (require.main === module) { //para dli ma auto call if i import
    addLink();
}
