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
exports.getToken = getToken;
const dotenv = __importStar(require("dotenv"));
const spotifyService_1 = require("../src/services/spotifyService");
const fs = __importStar(require("fs"));
dotenv.config();
const TOKEN_CACHE_FILE = '../token_cache.json';
async function getCachedToken() {
    try {
        if (fs.existsSync(TOKEN_CACHE_FILE)) {
            const cache = JSON.parse(fs.readFileSync(TOKEN_CACHE_FILE, 'utf8'));
            if (Date.now() < cache.expiresAt) {
                const timeLeft = cache.expiresAt - Date.now();
                const minutes = Math.floor(timeLeft / (1000 * 60));
                const expiresAt = new Date(cache.expiresAt).toLocaleTimeString();
                // console.log(`Using cached token (expires at ${expiresAt} [~${minutes}m] remaining`);
                return cache.token;
            }
        }
    }
    catch (error) {
        // console.log('Cache error, getting new token');
    }
    return null;
}
async function getToken(isFromPlaylist = false) {
    try {
        let accessToken = await getCachedToken();
        if (!accessToken) {
            // console.log('Getting new token...;');
            accessToken = await spotifyService_1.SpotifyService.getAccessToken();
            const cache = {
                token: accessToken,
                expiresAt: Date.now() + (3600 * 1000) - (5 * 60 * 1000) // 60 - 5 minutes so 5 minutes earlier, since 1 hr mag expire since gi request
            };
            fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(cache));
            // console.log('Token cached');
        }
        // console.log('Spotify Access Token fetched successfully');
        if (isFromPlaylist) {
            return accessToken;
        }
        else {
            process.exit(0);
        }
    }
    catch (error) {
        console.error('Error: ', error);
        process.exit(1);
    }
}
