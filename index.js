const express = require('express');
const fs = require('fs');
const YTDlpWrap = require('yt-dlp-wrap').default;

const app = express();
const PORT = 3000;

// Ensure yt-dlp has execute permission
const ytDlpPath = './yt-dlp';

// Set execute permission for yt-dlp if not already set
fs.chmodSync(ytDlpPath, 0o755); // Set execute permission to yt-dlp binary

// Serve static files from the root directory (index.html)
app.use(express.static(__dirname));

// Route to serve the index page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to handle video download requests
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const ytDlpWrap = new YTDlpWrap(ytDlpPath); // If yt-dlp is in the same directory

        // Execute yt-dlp command to download the video
        let ytDlpEventEmitter = ytDlpWrap
            .exec([url, '-f', 'best', '-o', 'output.mp4'])
            .on('progress', (progress) => {
                console.log(progress.percent, progress.totalSize, progress.currentSpeed, progress.eta);
            })
            .on('ytDlpEvent', (eventType, eventData) => {
                console.log(eventType, eventData);
            })
            .on('error', (error) => {
                console.error(error);
                res.status(500).json({ error: error.message || 'Error occurred while downloading' });
            })
            .on('close', () => {
                console.log('Download finished');
                res.json({ message: 'Download completed', download_url: 'output.mp4' });
            });

        console.log(ytDlpEventEmitter.ytDlpProcess.pid);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Route to get video metadata
app.get('/metadata', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const ytDlpWrap = new YTDlpWrap(ytDlpPath); // If yt-dlp is in the same directory
        
        let metadata = await ytDlpWrap.getVideoInfo(url);
        console.log(metadata.title);

        res.json({ title: metadata.title, description: metadata.description, uploader: metadata.uploader });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Error fetching video metadata' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
