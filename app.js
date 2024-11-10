import express from 'express';
import fetch from 'node-fetch'; // Importing node-fetch to make API requests
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

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
