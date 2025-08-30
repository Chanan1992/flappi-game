const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const scoreRoutes = require('./routes/score');
app.use('/api/score', scoreRoutes);

// Privacy page route
app.get("/privacy", (req, res) => {
  res.send(`
    <html>
      <head><title>Privacy Policy</title></head>
      <body>
        <h1>Privacy Policy</h1>
        <p>We respect your privacy. This game only stores your score and Pi username for leaderboard purposes. No personal data is shared with third parties.</p>
      </body>
    </html>
  `);
});

// Terms page route
app.get("/terms", (req, res) => {
  res.send(`
    <html>
      <head><title>Terms of Service</title></head>
      <body>
        <h1>Terms of Service</h1>
        <p>By playing this game, you agree that scores may be stored and displayed on the leaderboard. All payments with Pi are voluntary and non-refundable.</p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server draait op poort ${PORT}`);
});