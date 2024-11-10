const express = require('express');
const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;  // PORT পরিবেশ ভেরিয়েবল ব্যবহার করা

// yt-dlp বাইনারি সেটআপ
const ytDlpWrapInstance = new YTDlpWrap();

// ডাউনলোড ফোল্ডার তৈরি করা
const downloadFolder = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder);
}

// স্ট্যাটিক ফাইল সেবা করা
app.use(express.static(__dirname));

// ইন্ডেক্স পেজ সেবা করা
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ভিডিও ডাউনলোড করার রুট
app.get('/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const outputPath = path.join(downloadFolder, 'output.mp4');

  try {
    // yt-dlp কমান্ড এক্সিকিউট করা
    const result = await ytDlpWrapInstance.exec([url, '-f', 'best', '-o', outputPath]);

    if (result) {
      // ভিডিও ডাউনলোড সম্পন্ন হলে
      res.json({
        message: 'Download completed',
        download_url: `/downloads/output.mp4`,
      });
    } else {
      res.status(500).json({ error: 'Error occurred while downloading the video' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error occurred while downloading the video' });
  }
});

// মেটাডেটা রুট
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

// অ্যাপ্লিকেশন চালানো
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
