const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio'); // Import cheerio for HTML parsing
const ytdlp = require('yt-dlp');  // Import yt-dlp

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');  // রুট ডিরেক্টরি থেকে index.html ফাইল পাঠাবে
});

app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Use yt-dlp to get download information
        const info = await ytdlp(url);

        // Extract the best video download URL
        const downloadUrl = info.formats[0].url;  // Pick the best format URL

        if (downloadUrl) {
            res.json({
                message: 'File is ready to download',
                download_url: downloadUrl
            });
        } else {
            res.status(400).json({ error: 'Download link not found' });
        }
    } catch (error) {
        console.error('Error fetching download link:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
