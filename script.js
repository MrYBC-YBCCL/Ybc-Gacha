
// =====================================
// YBC GACHA - HOMEPAGE SYSTEM
// Temporary local demo system
// =====================================

const POINTS_PER_CLAIM = 10;
const CLAIM_INTERVAL = 5 * 60 * 1000;

// Load saved data
let points = Number(localStorage.getItem("ybcPoints")) || 0;
let nextClaim = Number(localStorage.getItem("ybcNextClaim")) || 0;

// Update point displays
function updatePoints() {
    document.getElementById("navPoints").textContent = points;
    document.getElementById("mainPoints").textContent = points;

    localStorage.setItem("ybcPoints", points);
}

// Claim points
function claimPoints() {
    const now = Date.now();

    if (now < nextClaim) {
        return;
    }

    points += POINTS_PER_CLAIM;
    nextClaim = now + CLAIM_INTERVAL;

    localStorage.setItem("ybcPoints", points);
    localStorage.setItem("ybcNextClaim", nextClaim);

    updatePoints();
    updateClaimDisplay();
}

// Update countdown and button
function updateClaimDisplay() {
    const button = document.getElementById("claimButton");
    const countdown = document.getElementById("countdown");
    const status = document.getElementById("claimStatus");

    const remaining = nextClaim - Date.now();

    if (remaining <= 0) {
        button.disabled = false;
        button.textContent = "Claim +10";
        countdown.textContent = "READY";
        status.textContent = "Your reward is ready to claim!";
        return;
    }

    button.disabled = true;
    button.textContent = "Not ready";
    status.textContent = "Your next reward is on its way.";

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    countdown.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

// Initial setup
function initialiseWebsite() {
    updatePoints();
    updateClaimDisplay();

    // Refresh countdown every second
    setInterval(updateClaimDisplay, 1000);
}

// Start website
initialiseWebsite();
