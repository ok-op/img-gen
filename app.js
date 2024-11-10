const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle the /download route to extract download link from URL
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Fetch the page content from the URL
        const response = await fetch(url);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error fetching from website: ${response.status} ${response.statusText}`);
        }

        const html = await response.text(); // Get raw HTML content
        const $ = cheerio.load(html); // Parse the HTML using cheerio

        // Get the download link (Ensure the selector is correct)
        const downloadLink = $('a#download-link').attr('href');

        if (downloadLink) {
            res.json({
                message: 'File is ready to download',
                download_url: downloadLink
            });
        } else {
            res.status(400).json({ error: 'Download link not found on the page' });
        }
    } catch (error) {
        console.error('Error fetching download link:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
