const express = require('express');
const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// yt-dlp binary path, সাধারণত yt-dlp-wrap এটি নিজে নিজেই handle করে।
const ytDlpWrapInstance = new YTDlpWrap();

// downloads ফোল্ডার তৈরি করুন যদি এটি না থাকে
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

app.use(express.static(__dirname));

// Serve the index page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to handle video download requests
app.get('/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const outputFilePath = path.join(downloadsDir, `${Date.now()}_output.mp4`);

  try {
    ytDlpWrapInstance
      .exec([url, '-f', 'best', '-o', outputFilePath])
      .on('progress', (progress) => {
        console.log(progress.percent, progress.totalSize, progress.currentSpeed, progress.eta);
      })
      .on('error', (error) => {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while downloading' });
      })
      .on('close', () => {
        console.log('Download finished');
        res.download(outputFilePath, 'video.mp4', (err) => {
          if (err) {
            console.error('Error sending file:', err);
          }
          // Download সম্পন্ন হলে ফাইলটি ডিলিট করুন
          fs.unlinkSync(outputFilePath);
        });
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get video metadata
app.get('/metadata', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const metadata = await ytDlpWrapInstance.getVideoInfo(url);
    res.json({
      title: metadata.title,
      description: metadata.description,
      uploader: metadata.uploader,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching video metadata' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
