const express = require('express');
const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// yt-dlp-wrap ইনস্ট্যান্স
const ytDlpWrap = new YTDlpWrap();

// downloads ডিরেক্টরি তৈরি করে যদি না থাকে
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

app.use(express.static(__dirname));

// মূল পেজ প্রদর্শন
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ভিডিও ডাউনলোডের জন্য রুট
app.get('/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const outputFilePath = path.join(downloadsDir, `${Date.now()}_output.mp4`);

  try {
    const ytDlpProcess = ytDlpWrap.execPromise([url, '-f', 'best', '-o', outputFilePath]);

    ytDlpProcess.then(() => {
      console.log('Download finished');
      res.download(outputFilePath, 'video.mp4', (err) => {
        if (err) {
          console.error('Error sending file:', err);
        }
        // ডাউনলোড শেষ হলে ফাইল মুছে দিন
        fs.unlinkSync(outputFilePath);
      });
    }).catch((error) => {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to download video' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// মেটাডেটা পাওয়ার জন্য রুট
app.get('/metadata', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const metadata = await ytDlpWrap.getVideoInfo(url);
    res.json({
      title: metadata.title,
      description: metadata.description,
      uploader: metadata.uploader,
      duration: metadata.duration,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching video metadata' });
  }
});

// সার্ভার শুরু
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
