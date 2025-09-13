// piAuth.js
let PiUser = null;

async function initPiAuth() {
  return new Promise((resolve, reject) => {
    if (!window.Pi) {
      reject("Pi SDK is not loaded. Make sure <script src='https://sdk.minepi.com/pi-sdk.js'></script> is in index.html");
      return;
    }

    // Initialize Pi SDK
    window.Pi.init({ version: "2.0"});

    // Ask permissions: username, payments (later for donate/extra life)
    const scopes = ["username", "payments"];

    // PiUser = {
    //     username: "test_usernieuw",
    //     uid: "12345",
    //     accessToken: "mock-token"
    //   };

      resolve(PiUser)

    window.Pi.authenticate(scopes, onIncompletePaymentFound)
      .then(({ user, accessToken }) => {
        PiUser = { ...user, accessToken };
        console.log("✅ Pi User logged in:", PiUser);
        resolve(PiUser);
      })
      .catch((err) => {
        console.error("❌ Pi Authentication failed:", err);
        reject(err);
      });
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

/**
 * Start een donatie van 1 Pi
 */
async function donateOnePi() {
  if (!PiUser) {
    console.error("❌ No user logged in");
    return;
  }

  try {
    await window.Pi.createPayment(
      {
        amount: 1,
        memo: "Donation for more game",
        metadata: { reason: "donation" },
      },
      {
        onReadyForServerApproval: (paymentId) => {
          console.log("💰 Payment ready for server-approval:", paymentId);
          fetch("/api/pi/payments/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("💰 Payment ready for server-completion:", paymentId, txid);
          fetch("/api/pi/payments/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
        },
        onCancel: (paymentId) => {
          console.warn("🚫 Payment cancelled:", paymentId);
        },
        onError: (error, payment) => {
          console.error("❌ Payment error:", error, payment);
        },
      }
    );
  } catch (err) {
    console.error("❌ Not able to start donation payment:", err);
  }
}

async function buyRetry() {
  if (!PiUser) {
    console.error("❌ No user logged in");
    return;
  }

  try {
    await window.Pi.createPayment(
      {
        amount: 0.1, // bijvoorbeeld halve Pi voor retry
        memo: "Extra retry",
        metadata: { reason: "retry" },
      },
      {
        onReadyForServerApproval: (paymentId) => {
          console.log("🛒 Retry payment ready for approval:", paymentId);
          fetch("/api/pi/payments/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✅ Retry payment ready for completion:", paymentId, txid);
          fetch("/api/pi/payments/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          }).then(() => {
            // 🎮 Geef speler nu een herkansing
            window.dispatchEvent(new CustomEvent("retry-purchased"));
          });
        },
        onCancel: (paymentId) => {
          console.warn("🚫 Retry payment cancelled:", paymentId);
        },
        onError: (error, payment) => {
          console.error("❌ Retry payment error:", error, payment);
        },
      }
    );
  } catch (err) {
    console.error("❌ Not able to start retry payment:", err);
  }
}


// function shareDialog() {
//   window.Pi.openShareDialog("A title", "A message");
// }

// Exports
window.initPiAuth = initPiAuth;
window.getPiUser = getPiUser;
window.donateOnePi = donateOnePi;
window.buyRetry = buyRetry;
// window.shareDialog = shareDialog;
