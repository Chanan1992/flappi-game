// middleware/requirePiAuth.js
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function requirePiAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = auth.split(" ")[1];

  try {
    const response = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok || !data || !data.uid) {
      console.error("❌ Pi auth failed:", data);
      return res.status(403).json({ error: "Invalid Pi access token" });
    }

    // ✅ User is geauthenticeerd
    req.user = data; // bevat o.a. uid en username
    next();
  } catch (err) {
    console.error("❌ Pi auth exception:", err);
    res.status(500).json({ error: "Auth check failed" });
  }
}

module.exports = requirePiAuth;
