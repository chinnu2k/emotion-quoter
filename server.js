const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

let cachedQuote = null;
let cacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Pass emotion → map to one or more tags
const emotionTags = {
  happy: "happiness,inspirational",
  sad: "wisdom",
  angry: "wisdom",
  motivated: "success,inspirational",
  love: "love"
};

app.use(express.static("public"));

app.get("/api/quotes", async (req, res) => {
  const now = Date.now();

  if (cachedQuote && (now - cacheTime) < CACHE_DURATION) {
    return res.json(cachedQuote);
  }

  try {
    const response = await axios.get("https://zenquotes.io/api/random");

    cachedQuote = response.data.map(q => ({
      quote: q.q,
      author: q.a
    }));

    cacheTime = now;
    res.json(cachedQuote);

  } catch (err) {
    if (cachedQuote) {
      return res.json(cachedQuote); // fallback to last good quote
    }
    res.status(500).json([{ quote: "Quote service unavailable", author: "" }]);
  }
});


app.get("/api/history", (req, res) => {
  const history = JSON.parse(fs.readFileSync("history.json"));
  res.json(history.reverse());
});


app.post("/api/history", express.json(), (req, res) => {
  const { emotion } = req.body;

  const history = JSON.parse(fs.readFileSync("history.json"));

  history.push({
    id: uuidv4(),
    emotion,
    date: new Date().toISOString()
  });

  fs.writeFileSync("history.json", JSON.stringify(history, null, 2));
  res.json({ success: true });
});


app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
