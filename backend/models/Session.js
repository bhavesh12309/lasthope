const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    wordsTyped: { type: Number, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    mode: { type: String, default: 'words' } 
});

module.exports = mongoose.model('Session', sessionSchema);
