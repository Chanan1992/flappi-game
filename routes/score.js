const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/', async (req, res) => {
    const { player, score } = req.body;

  const { error } = await supabase
    .from('scores')
    .upsert({ player, score }, { onConflict: 'player' });

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Score opgeslagen of bijgewerkt' });
});

router.get('/leaderboard', async (req, res) => {
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Highscore van 1 speler ophalen
router.get("/:player", async (req, res) => {
  const { player } = req.params;

  try {
    const { data, error } = await supabase
      .from("scores")
      .select("score")
      .eq("player", player)
      .single();

    if (error && error.code !== "PGRST116") throw error; // Geen resultaat = ok
    res.json(data || { score: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kon highscore niet ophalen" });
  }
});

module.exports = router;
