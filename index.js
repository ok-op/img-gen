const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio'); // Import cheerio for HTML parsing
const { exec } = require('child_process'); // Import exec to use yt-dlp in shell

const app = express();
const PORT = process.env.PORT || 3000; // Set PORT from environment or default to 3000

// Serve static files from the root directory (no need for a 'public' folder)
app.use(express.static(__dirname));  // Serve files from the current directory

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');  // রুট ডিরেক্টরি থেকে index.html ফাইল পাঠাবে
});

app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Use yt-dlp to get video download URL
        const command = `yt-dlp -g ${url}`; // Use yt-dlp to get the video URL (without downloading it)
        
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error('Error executing yt-dlp:', err);
                return res.status(500).json({ error: 'Error executing yt-dlp' });
            }
            if (stderr) {
                console.error('yt-dlp stderr:', stderr);
                return res.status(500).json({ error: stderr });
            }

            const downloadUrl = stdout.trim(); // yt-dlp returns a URL, so trim it

            if (downloadUrl) {
                res.json({
                    message: 'File is ready to download',
                    download_url: downloadUrl
                });
            } else {
                res.status(400).json({ error: 'Download link not found' });
            }
        });
    } catch (error) {
        console.error('Error fetching download link:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
