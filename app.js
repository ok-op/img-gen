const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio'); // Import cheerio for HTML parsing

const app = express();
const PORT = 3000;

// Static files will now be served directly from the root directory
// app.use(express.static('public'));  // Removed this line

app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Fetch the page content of the given URL
        const response = await fetch(url);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error fetching from website: ${response.status} ${response.statusText}`);
        }

        const html = await response.text(); // Get the raw HTML content
        const $ = cheerio.load(html); // Parse the HTML with cheerio

        // Assuming the download link is contained in a specific element, e.g., <a> with id 'download-link'
        const downloadLink = $('#download-link').attr('href');

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
