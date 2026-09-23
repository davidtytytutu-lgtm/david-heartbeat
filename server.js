const http = require("http");

// ==================================================
// CONFIGURATION
// ==================================================

const PORT = process.env.PORT || 10000;

const DAVID_RANDOM_URL =
    "https://david-random.onrender.com/api/status";

const HEARTBEAT_DELAY = 5000;

// ==================================================
// SERVEUR HTTP
// ==================================================

const server = http.createServer((req, res) => {

    // ==================================================
    // HEARTBEAT REÇU
    // ==================================================

    if (req.url === "/heartbeat") {

        console.log(
            "💓 Heartbeat reçu de DAVID RANDOM"
        );

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "ok",
            heartbeat: true,
            from: "HEARTBEAT-SERVER"
        }));

        console.log(
            `⏱️ Prochain heartbeat vers DAVID RANDOM dans ${HEARTBEAT_DELAY / 1000}s`
        );

        setTimeout(() => {
            sendHeartbeatToDavidRandom();
        }, HEARTBEAT_DELAY);

        return;
    }

    // ==================================================
    // PAGE PRINCIPALE
    // ==================================================

    if (req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end(
            "💓 DAVID RANDOM HEARTBEAT SERVER est en ligne !"
        );

        return;
    }

    // ==================================================
    // 404
    // ==================================================

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("404 - Not Found");
});

// ==================================================
// ENVOI HEARTBEAT → DAVID RANDOM
// ==================================================

async function sendHeartbeatToDavidRandom() {

    try {

        console.log(
            "💓 HEARTBEAT SERVER → DAVID RANDOM"
        );

        const response = await fetch(
            DAVID_RANDOM_URL
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const data = await response.json();

        if (data.online !== true) {

            throw new Error(
                "DAVID RANDOM indique qu'il est hors ligne"
            );

        }

        console.log(
            "✅ DAVID RANDOM a répondu : ONLINE"
        );

        console.log(
            `👥 Utilisateurs : ${data.users}`
        );

        console.log(
            `🔌 WebSocket : ${data.websocket}`
        );

        console.log(
            `🐙 GitHub : ${data.github ? "ONLINE" : "OFFLINE"}`
        );

        console.log(
            `⏱️ Prochain heartbeat dans ${HEARTBEAT_DELAY / 1000}s`
        );

        setTimeout(() => {
            sendHeartbeatToDavidRandom();
        }, HEARTBEAT_DELAY);

    } catch (error) {

        console.error(
            "❌ Erreur heartbeat → DAVID RANDOM :",
            error.message
        );

        console.log(
            "🔄 Nouvelle tentative dans 30 secondes..."
        );

        setTimeout(() => {
            sendHeartbeatToDavidRandom();
        }, 30000);
    }
}

// ==================================================
// DÉMARRAGE SERVEUR
// ==================================================

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `💓 DAVID RANDOM HEARTBEAT SERVER démarré sur le port ${PORT}`
        );

        console.log(
            `🌐 Port : ${PORT}`
        );

        console.log(
            "🎯 Cible : https://david-random.onrender.com/api/status"
        );

        console.log(
            "⏱️ Premier heartbeat vers DAVID RANDOM dans 0.5 seconde..."
        );

        // Premier heartbeat
        setTimeout(() => {
            sendHeartbeatToDavidRandom();
        }, 500);

    }
);
