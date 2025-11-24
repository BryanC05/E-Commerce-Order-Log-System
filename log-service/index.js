const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const connectWithRetry = () => {
  console.log('MongoDB connection with retry');
  mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo-db:27017/logs_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection unsuccessful, retry after 5 seconds.', err);
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
        res.status(201).send({ message: 'Log saved' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(3000, () => console.log('Log service running on port 3000'));
