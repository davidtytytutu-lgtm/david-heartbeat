"use strict";

const http = require("http");

// ==================================================
// CONFIGURATION
// ==================================================

const PORT = process.env.PORT || 10000;

const DAVID_RANDOM_URL =
    "https://david-random.onrender.com";

const HEARTBEAT_DELAY = 5000;

// ==================================================
// ÉTAT
// ==================================================

let heartbeatCount = 0;
let lastHeartbeat = null;
let lastReturnHeartbeat = null;

// ==================================================
// SERVEUR HTTP
// ==================================================

const server = http.createServer(async (req, res) => {

    // ==================================================
    // HEARTBEAT REÇU DE DAVID RANDOM
    // ==================================================

    if (
        req.method === "GET" &&
        req.url === "/heartbeat"
    ) {

        heartbeatCount++;

        lastHeartbeat = new Date().toISOString();

        console.log("");
        console.log(
            "💓 DAVID RANDOM → DAVID HEARTBEAT"
        );

        console.log(
            "📥 HEARTBEAT REÇU"
        );

        console.log(
            `🔢 Heartbeats reçus : ${heartbeatCount}`
        );

        // --------------------------------------------------
        // CONFIRMATION HTTP
        // --------------------------------------------------

        res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        });

        res.end(
            JSON.stringify({
                status: "ok",
                received: true,
                message: "Heartbeat received",
                from: "DAVID-HEARTBEAT",
                heartbeat_number: heartbeatCount,
                timestamp: lastHeartbeat
            })
        );

        console.log(
            "📤 Confirmation envoyée à DAVID RANDOM"
        );

        // --------------------------------------------------
        // ENVOI DU HEARTBEAT RETOUR
        // --------------------------------------------------

        setTimeout(() => {
            sendReturnHeartbeat();
        }, 100);

        return;
    }

    // ==================================================
    // PAGE PRINCIPALE
    // ==================================================

    if (
        req.method === "GET" &&
        req.url === "/"
    ) {

        res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        });

        res.end(
            JSON.stringify({
                online: true,
                name: "DAVID HEARTBEAT",
                target: "DAVID RANDOM",
                heartbeat_delay: HEARTBEAT_DELAY,
                heartbeat_received: heartbeatCount,
                last_heartbeat: lastHeartbeat,
                last_return_heartbeat: lastReturnHeartbeat
            })
        );

        return;
    }

    // ==================================================
    // 404
    // ==================================================

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(
        JSON.stringify({
            error: "Not Found"
        })
    );
});

// ==================================================
// HEARTBEAT RETOUR → DAVID RANDOM
// ==================================================

async function sendReturnHeartbeat() {

    try {

        console.log("");
        console.log(
            "💓 DAVID HEARTBEAT → DAVID RANDOM"
        );

        const response = await fetch(
            `${DAVID_RANDOM_URL}/heartbeat/return`
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data = await response.json();

        // --------------------------------------------------
        // VÉRIFICATION DE LA CONFIRMATION
        // --------------------------------------------------

        if (
            data.received !== true
        ) {

            throw new Error(
                "DAVID RANDOM n'a pas confirmé la réception"
            );
        }

        lastReturnHeartbeat =
            new Date().toISOString();

        console.log(
            "📥 Confirmation reçue de DAVID RANDOM"
        );

        console.log(
            "✅ HEARTBEAT RETOUR REÇU"
        );

        console.log(
            `📝 Message : ${data.message}`
        );

        console.log(
            `⏱️ Prochain cycle dans ${HEARTBEAT_DELAY / 1000}s`
        );

        // --------------------------------------------------
        // PROCHAIN CYCLE
        // --------------------------------------------------

        setTimeout(() => {

            startHeartbeat();

        }, HEARTBEAT_DELAY);

    } catch (error) {

        console.error(
            "❌ Erreur heartbeat retour :",
            error.message
        );

        console.log(
            "🔄 Nouvelle tentative dans 30 secondes..."
        );

        setTimeout(() => {

            startHeartbeat();

        }, 30000);
    }
}

// ==================================================
// DAVID HEARTBEAT → DAVID RANDOM
// ==================================================

async function startHeartbeat() {

    try {

        console.log("");
        console.log(
            "💓 DAVID HEARTBEAT → DAVID RANDOM"
        );

        console.log(
            "📡 Vérification de DAVID RANDOM..."
        );

        const response = await fetch(
            `${DAVID_RANDOM_URL}/api/status`
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data = await response.json();

        if (
            data.online !== true
        ) {

            throw new Error(
                "DAVID RANDOM indique qu'il est hors ligne"
            );
        }

        console.log(
            "✅ DAVID RANDOM ONLINE"
        );

        console.log(
            `👥 Utilisateurs : ${data.users}`
        );

        console.log(
            `🔌 WebSocket : ${data.websocket}`
        );

        console.log(
            "🐙 GitHub :",
            data.github
                ? "ONLINE"
                : "OFFLINE"
        );

        console.log(
            "⏱️ En attente du prochain heartbeat..."
        );

        // --------------------------------------------------
        // Le prochain heartbeat sera lancé par DAVID RANDOM.
        // --------------------------------------------------

    } catch (error) {

        console.error(
            "❌ Erreur → DAVID RANDOM :",
            error.message
        );

        console.log(
            "🔄 Nouvelle tentative dans 30 secondes..."
        );

        setTimeout(() => {

            startHeartbeat();

        }, 30000);
    }
}

// ==================================================
// DÉMARRAGE
// ==================================================

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "================================"
        );

        console.log(
            "💓 DAVID HEARTBEAT"
        );

        console.log(
            "================================"
        );

        console.log(
            `🌐 Port : ${PORT}`
        );

        console.log(
            "🎯 Serveur : DAVID RANDOM"
        );

        console.log(
            "🔗 https://david-random.onrender.com"
        );

        console.log(
            `⏱️ Délai : ${HEARTBEAT_DELAY / 1000}s`
        );

        console.log(
            "================================"
        );

        console.log(
            "⏳ En attente du premier heartbeat de DAVID RANDOM..."
        );

        console.log(
            "================================"
        );
    }
);
