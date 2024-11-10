const express = require('express');
const path = require('path');

// Use dynamic import for node-fetch (because it's an ES module)
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;  // Set PORT directly instead of using process.env

// Serve static files directly from the root directory
app.use(express.static(path.join(__dirname)));

// Handle file download requests
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Call the Nyxs API to get the download URL
        const apiUrl = `https://dl.nyxs.pw/api?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'success' && data.download_url) {
            // Send the download URL to the client
            res.json({
                message: 'File is ready to download',
                download_url: data.download_url
            });
        } else {
            res.status(400).json({ error: 'Unable to fetch the download link from the API' });
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
