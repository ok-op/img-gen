const express = require('express');
const fetch = require('node-fetch'); // Importing node-fetch to make API requests
const cheerio = require('cheerio'); // Importing cheerio to parse HTML
const path = require('path');

const app = express();

// Set the port directly
const PORT = 3000; // Port set directly in the code

// Serve static files (like HTML, CSS, JS) from the root directory
app.use(express.static(path.join(__dirname)));

// Default route to serve your HTML page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file download requests
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Fetch the HTML of the page using node-fetch
        const response = await fetch(url);
        const html = await response.text();

        // Parse the HTML with cheerio to extract the download link
        const $ = cheerio.load(html);
        const downloadUrl = $('a#downloadLink').attr('href'); // Adjust the selector as needed

        if (downloadUrl) {
            res.json({
                message: 'File is ready to download',
                download_url: downloadUrl
            });
        } else {
            res.status(400).json({ error: 'Unable to fetch the download link from the page' });
        }
    } catch (error) {
        console.error('Error fetching download link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
