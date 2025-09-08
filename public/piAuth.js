// piAuth.js
let PiUser = null;

async function initPiAuth() {
  return new Promise((resolve, reject) => {
    if (!window.Pi) {
      reject("Pi SDK is not loaded. Make sure <script src='https://sdk.minepi.com/pi-sdk.js'></script> is in index.html");
      return;
    }

    // Initialize Pi SDK
    // window.Pi.init({ version: "2.0", sandbox: true });

    // Ask permissions: username, payments (later for donate/extra life)
    const scopes = ["username", "payments"];

    PiUser = {
        username: "test_usernieuw",
        uid: "12345",
        accessToken: "mock-token"
      };

      resolve(PiUser)

    // window.Pi.authenticate(scopes, onIncompletePaymentFound)
    //   .then(({ user, accessToken }) => {
    //     PiUser = { ...user, accessToken };
    //     console.log("✅ Pi User logged in:", PiUser);
    //     resolve(PiUser);
    //   })
    //   .catch((err) => {
    //     console.error("❌ Pi Authentication failed:", err);
    //     reject(err);
    //   });
  });
}

// Example: handle incomplete payments (required by Pi SDK)
function onIncompletePaymentFound(payment) {
  console.warn("⚠️ Incomplete payment found:", payment);
  // Hier kun je de payment afhandelen (bijv. via je backend bevestigen).
}

// Helper: get Pi user anywhere in game
function getPiUser() {
  return PiUser;
}

// Exports
window.initPiAuth = initPiAuth;
window.getPiUser = getPiUser;
