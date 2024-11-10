const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio'); // Import cheerio for HTML parsing

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
        // Construct the request URL for nyxs.pw service
        const downloadUrl = `https://dl.nyxs.pw/?url=${encodeURIComponent(url)}`;

        // Fetch the page content of the given URL
        const response = await fetch(downloadUrl);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error fetching from nyxs.pw: ${response.status} ${response.statusText}`);
        }

        const html = await response.text(); // Get the raw HTML content
        const $ = cheerio.load(html); // Parse the HTML with cheerio

        // Look for the download link using a more specific selector (adjust this according to the HTML structure)
        const downloadLink = $('a.download-btn').attr('href');  // Example, replace with correct class or selector

        console.log('Extracted download link:', downloadLink); // Log for debugging

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
