"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeSearch = void 0;
const yt_search_1 = __importDefault(require("yt-search"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class YoutubeSearch {
    static async search(title, artist) {
        try {
            const query = `${title} ${artist}`;
            console.log(`Searching for ${query}`);
            const results = await (0, yt_search_1.default)(query);
            if (results.videos && results.videos.length > 0) {
                const video = results.videos[0]; // First only kay likely mas famous and original
                return {
                    videoId: video.videoId,
                    title: video.title,
                    author: video.author.name,
                    views: video.views,
                    duration: video.duration.seconds,
                    timestamp: video.timestamp
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error searching for video:', error);
            return null;
        }
    }
}
exports.YoutubeSearch = YoutubeSearch;
