const express = require("express");
const router = express.Router();

const PI_API_KEY = process.env.PI_API_KEY;

// Approve payment (Pi SDK roept dit indirect via je frontend aan)
router.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // lege body
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Approve error:", err.message);
    res.status(500).json({ error: "Approve failed" });
  }
});

// Complete payment (Pi SDK → frontend → backend → Pi servers)
router.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Complete error:", data);
      return res.status(response.status).json({ error: data });
    }

    console.log("✅ Payment completed:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Complete exception:", err.message);
    res.status(500).json({ error: "Complete failed" });
  }
});

// Optioneel: check status van een payment
router.get("/status/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Status error:", data);
      return res.status(response.status).json({ error: data });
    }

    console.log("ℹ️ Payment status:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Status exception:", err.message);
    res.status(500).json({ error: "Status check failed" });
  }
});

module.exports = router;
