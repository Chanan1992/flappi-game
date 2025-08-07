const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/', async (req, res) => {
    const { player, score } = req.body;
    const { error } = await supabase.from('scores').insert({ player, score });
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Score opgeslagen' });
});

router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
