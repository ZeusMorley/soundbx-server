import axios from 'axios';
import yts from 'yt-search';
import dotenv from 'dotenv';
dotenv.config();

interface YoutubeSearchResponse {
    videoId: string;
    title: string;
    author: string;
    views: number;
    duration: number;
    timestamp: string;
}

export class YoutubeSearch {
    static async search(title: string, artist: string): Promise<YoutubeSearchResponse | null> {
        try {
            const query = `${title} ${artist}`;	
            console.log(`Searching for ${query}`);

            const results = await yts(query);

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
        } catch (error) {
            console.error('Error searching for video:', error);
            return null;
        }
    }
}