# soundbx server
A Node.js TypeScript server for the soundbx mobile app(soon).

## Reason
My student discount is expiring


##  Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Spotify Developer Account

### Installation
```bash
# Clone the repository
git clone https://github.com/ZeusMorley/soundbx-server.git
cd soundbx-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Spotify credentials
```

### Environment Setup
Create a `.env` file in the root directory:
```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
PORT=3000
```

## 📖 Usage

### Get Spotify Access Token
```bash
npm run access
# Returns: Spotify Access Token with expiry time
```

### Get the music in the playlist
```bash
npm run playlist <playlist_id>
# Example: npm run playlist 37i9dQZF1DXcBWIGoYBM5M
```

### Append Corresponding Yt link for each music
```bash
npm run getLinks
# Reads playlist.csv and adds YouTube video IDs
```
### Download Each (Soon)


## 🔍 Troubleshooting

### Common Issues

**Token Expired Error**
- Run `npm run access` to get a fresh token
- Check your `.env` file has correct credentials

**Playlist Not Found**
- Verify the playlist ID is correct (22 characters)
- Ensure the playlist is public or you have access

**YouTube Search Fails**
- Check your internet connection
- The script includes rate limiting - wait between searches

---