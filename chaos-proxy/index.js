const express = require('express');
const httpProxy = require('http-proxy');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const proxy = httpProxy.createProxyServer();

// KONFIGURASI CHAOS
const TARGET_URL = 'http://localhost:8000'; // Target: Laravel Anda
const PORT = 9000; // Port Proxy ini
const ERROR_RATE = 0.2; // 20% Request akan gagal
const LATENCY_MS = 2000; // Delay 2 detik (Simulasi 3G)

app.use(morgan('dev')); // Log traffic ke terminal
app.use(cors());

// Middleware "Kekacauan"
app.use((req, res, next) => {
    const luck = Math.random(); // Angka acak 0.0 - 1.0

    // Skenario 1: Random Error (20% kemungkinan)
    if (luck < ERROR_RATE) {
        console.log('💥 CHAOS: Injecting 500 Error!');
        return res.status(500).json({ 
            error: 'CHAOS_PROXY_ERROR', 
            message: 'Ini adalah error buatan Chaos Proxy!' 
        });
    }

    // Skenario 2: Latency (Delay)
    // Kita tahan request selama 2 detik sebelum diteruskan ke next()
    console.log(`⏳ CHAOS: Delaying request for ${LATENCY_MS}ms...`);
    setTimeout(() => {
        next();
    }, LATENCY_MS);
});

// Teruskan request ke Server Asli (Laravel)
// Gunakan app.use() agar menangkap semua method (GET, POST, dll) & semua path
app.use((req, res) => {
    proxy.web(req, res, { target: TARGET_URL }, (err) => {
        console.error("Proxy Error:", err.message);
        res.status(502).json({ error: 'Bad Gateway', message: 'Target server mati' });
    });
});

app.listen(PORT, () => {
    console.log(`😈 Chaos Proxy running on http://localhost:${PORT}`);
    console.log(`🎯 Target: ${TARGET_URL}`);
    console.log(`💥 Error Rate: ${ERROR_RATE * 100}% | ⏳ Latency: ${LATENCY_MS}ms`);
});