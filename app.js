import express from 'express';
import fetch from 'node-fetch'; // Using import instead of require

const app = express();
const PORT = 3000;

app.use(express.static(".")); // Serve static files from the root directory

// Endpoint to generate image based on user input (prompt, model, style)
app.get("/generate-image", async (req, res) => {
  const { prompt, model, style } = req.query;

  try {
    const response = await fetch(`https://api.nyxs.pw/ai-image/image-generator?prompt=${encodeURIComponent(prompt)}&model=${encodeURIComponent(model)}&style=${encodeURIComponent(style)}`);
    const data = await response.json();

    if (data.status && data.image_url) {
      res.json({ image_url: data.image_url });
    } else {
      res.json({ error: "Image generation failed. Model or style may be invalid." });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch image. Please try again." });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
