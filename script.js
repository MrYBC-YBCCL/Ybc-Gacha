
// =====================================
// YBC GACHA - HOMEPAGE SYSTEM
// DATABASE-POWERED POINTS AND CLAIMING
// =====================================

const POINTS_PER_CLAIM = 10;
const CLAIM_INTERVAL = 5 * 60 * 1000;

const SUPABASE_URL = "https://fselbwilstujrholgdld.supabase.co";
const SUPABASE_KEY = "sb_publishable_gDKRrp8nRXw5RGQY2rbhpA_lWKR1QD0";

const CLAIM_API = `${SUPABASE_URL}/functions/v1/clever-responder`;

let points = 0;
let nextClaim = 0;
let claiming = false;

// =====================================
// API REQUEST
// =====================================

async function api(action) {
    const token = localStorage.getItem("ybcGachaSession");

    if (!token) {
        throw new Error("You need to log in first.");
    }

    const response = await fetch(CLAIM_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY
        },
        body: JSON.stringify({
            action,
            token
        })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || "Request failed.");
    }

    return data;
}

// =====================================
// UPDATE POINT DISPLAY
// =====================================

function updatePoints() {
    const navPoints = document.getElementById("navPoints");
    const mainPoints = document.getElementById("mainPoints");

    if (navPoints) navPoints.textContent = points;
    if (mainPoints) mainPoints.textContent = points;
}

// =====================================
// LOAD SAVED POINTS FROM DATABASE
// =====================================

async function loadPoints() {
    try {
        const data = await api("get_points");

        points = Number(data.points) || 0;

        nextClaim = data.next_claim_at
            ? new Date(data.next_claim_at).getTime()
            : 0;

        updatePoints();
        updateClaimDisplay();

    } catch (error) {
        console.error("Could not load points:", error);

        const status = document.getElementById("claimStatus");

        if (status) {
            status.textContent = error.message;
        }
    }
}

// =====================================
// CLAIM +10 POINTS
// =====================================

async function claimPoints() {
    if (claiming) return;

    if (Date.now() < nextClaim) {
        updateClaimDisplay();
        return;
    }

    claiming = true;
    updateClaimDisplay();

    try {
        const data = await api("claim_points");

        points = Number(data.points) || 0;

        nextClaim = data.next_claim_at
            ? new Date(data.next_claim_at).getTime()
            : 0;

        updatePoints();

        if (data.claimed) {
            console.log("Successfully claimed 10 points!");
        } else {
            alert(data.message || "Your reward is not ready yet.");
        }

    } catch (error) {
        console.error("Claim error:", error);
        alert(error.message || "Could not claim points.");

    } finally {
        claiming = false;
        updateClaimDisplay();
    }
}

// =====================================
// CLAIM COUNTDOWN
// =====================================

function updateClaimDisplay() {
    const button = document.getElementById("claimButton");
    const countdown = document.getElementById("countdown");
    const status = document.getElementById("claimStatus");

    if (!button || !countdown || !status) return;

    if (claiming) {
        button.disabled = true;
        button.textContent = "Claiming...";
        return;
    }

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

// =====================================
// INITIALISE WEBSITE
// =====================================

async function initialiseWebsite() {
    updatePoints();

    await loadPoints();

    updateClaimDisplay();

    setInterval(updateClaimDisplay, 1000);
}

// =====================================
// START
// =====================================

initialiseWebsite();
