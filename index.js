const express = require('express');
const YTDlpWrap = require('yt-dlp-wrap').default;

const app = express();
const PORT = 3000;

const ytDlpPath = 'yt-dlp';  // 'yt-dlp' পাথটি এখানে থাকতে হবে যেহেতু এটি প্যাকেজে ইনস্টল হয়েছে

// Serve static files
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
    const ytDlpWrapInstance = new YTDlpWrap(ytDlpPath);

    ytDlpWrapInstance
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
    const ytDlpWrapInstance = new YTDlpWrap(ytDlpPath);

    const metadata = await ytDlpWrapInstance.getVideoInfo(url);
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
