const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    settings: {
        theme: { type: String, default: 'dark' },
        language: { type: String, default: 'en' }
    },
    stats: {
        totalWords: { type: Number, default: 0 },
        totalTime: { type: Number, default: 0 },
        bestWpm: { type: Number, default: 0 },
        averageWpm: { type: Number, default: 0 },
        totalAccuracy: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        xp: { type: Number, default: 0 },
        achievements: [{ type: String }],
        dailyGoal: { type: Number, default: 100 },
        dailyProgress: { type: Number, default: 0 },
        lastSessionDate: { type: String, default: () => new Date().toDateString() }
    }
});

module.exports = mongoose.model('User', userSchema);
