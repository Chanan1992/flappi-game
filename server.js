const express = require('express');
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const scoreRoutes = require('./routes/score');
app.use('/api/score', scoreRoutes);

// Privacy page route
app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "privacy.html"));
});

// Terms page route
app.get("/terms", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "terms.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server draait op poort ${PORT}`);
});