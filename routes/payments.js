const express = require("express");
const axios = require("axios");
const router = express.Router();

const PI_API_KEY = process.env.PI_API_KEY;

// Approve payment (Pi SDK roept dit indirect via je frontend aan)
router.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Payment approved:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Approve error:", err.response?.data || err.message);
    res.status(500).json({ error: "Approve failed" });
  }
});

// Complete payment (wordt aangeroepen met paymentId + txid)
router.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  try {
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Payment completed:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Complete error:", err.response?.data || err.message);
    res.status(500).json({ error: "Complete failed" });
  }
});

module.exports = router;
