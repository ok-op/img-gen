const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio'); // Import cheerio for HTML parsing

const app = express();
const PORT = 3000;

// Serve static files (including index.html) from the root directory
app.use(express.static(__dirname));  // __dirname will serve files from the root directory

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

        // Extract download link from the page
        const downloadLink = $('a').attr('href'); // Assuming the download link is inside an <a> tag

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

// Serve index.html directly from the root directory
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');  // Serve the index.html file
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
