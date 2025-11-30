const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const connectWithRetry = () => {
    mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo-db:27017/logs_db')
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => {
            console.error('MongoDB error, retry in 5s...', err);
            setTimeout(connectWithRetry, 5000);
        });
};
connectWithRetry();

const LogSchema = new mongoose.Schema({
    service: String,
    action: String,
    user_id: Number,
    details: Object,
    timestamp: { type: Date, default: Date.now }
});
const Log = mongoose.model('Log', LogSchema);

app.post('/logs', async (req, res) => {
    try {
        const newLog = new Log(req.body);
        await newLog.save();
        
        console.log("Log saved:", req.body.action);

        // --- PERUBAHAN: Emit langsung di sini (Tanpa Change Stream) ---
        io.emit('new_log', newLog); 
        // --------------------------------------------------------------

        res.status(201).send({ message: 'Log saved' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

server.listen(3000, () => console.log('Log service running on port 3000'));
console.log('App running in: http://localhost:8000/dashboard.html');
