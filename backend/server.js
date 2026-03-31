require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const mongoose = require('mongoose');

const User = require('./models/User');
const Session = require('./models/Session');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'typing-app-secret-2024';
const DATA_DIR = path.join(__dirname, 'data');
const LESSONS_FILE = path.join(DATA_DIR, 'lessons.json');
const ACHIEVEMENTS_FILE = path.join(DATA_DIR, 'achievements.json');

// Ensure static data files exist if missing locally
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LESSONS_FILE)) fs.writeFileSync(LESSONS_FILE, '[]');
if (!fs.existsSync(ACHIEVEMENTS_FILE)) fs.writeFileSync(ACHIEVEMENTS_FILE, '[]');

// ─── Helpers ─────────────────────────────────────────────────────────────────
const readJSON = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const calcStreak = (userSessions) => {
    if (!userSessions || !userSessions.length) return 0;
    const days = [...new Set(userSessions.map(s => new Date(s.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
    let streak = 1;
    for (let i = 1; i < days.length; i++) {
        const diff = (new Date(days[i - 1]) - new Date(days[i])) / 86400000;
        if (diff === 1) streak++;
        else break;
    }
    return streak;
};

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─── Auth Routes ─────────────────────────────────────────────────────────────

app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ error: 'All fields required' });
        if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50)
            return res.status(400).json({ error: 'Name must be 2-50 characters' });
        if (!validator.isEmail(email))
            return res.status(400).json({ error: 'Invalid email address' });
        if (password.length < 6 || password.length > 100)
            return res.status(400).json({ error: 'Password must be 6-100 characters' });

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser)
            return res.status(409).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = `user_${Date.now()}`;
        
        const newUser = new User({
            id: userId,
            name: validator.escape(name.trim()),
            email: email.toLowerCase(),
            password: hashedPassword,
            settings: { theme: 'dark', language: 'en' },
            stats: {
                totalWords: 0, totalTime: 0, bestWpm: 0, averageWpm: 0,
                totalAccuracy: 0, level: 1, xp: 0, achievements: [],
                dailyGoal: 100, dailyProgress: 0,
                lastSessionDate: new Date().toDateString(),
            }
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
        
        const safeUser = newUser.toObject();
        delete safeUser.password;
        
        res.status(201).json({ token, user: safeUser });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email address' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        const safeUser = user.toObject();
        delete safeUser.password;
        
        res.json({ token, user: safeUser });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ id: req.userId });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const safeUser = user.toObject();
        delete safeUser.password;
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── User CRUD Routes ─────────────────────────────────────────────────────────

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id }).select('-password -settings -email');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/users/:id', authMiddleware, async (req, res) => {
    if (req.userId !== req.params.id) return res.status(403).json({ error: 'Forbidden' });

    try {
        const { name, settings } = req.body;
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50)
                return res.status(400).json({ error: 'Name must be 2-50 characters' });
            user.name = validator.escape(name.trim());
        }
        
        if (settings !== undefined && typeof settings === 'object') {
            const allowedThemes = ['dark', 'light', 'system', 'ocean', 'forest', 'sunset'];
            const allowedLangs = ['en', 'es', 'fr', 'de', 'hi', 'jp'];
            if (settings.theme && allowedThemes.includes(settings.theme)) user.settings.theme = settings.theme;
            if (settings.language && allowedLangs.includes(settings.language)) user.settings.language = settings.language;
        }

        await user.save();
        const safeUser = user.toObject();
        delete safeUser.password;
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/users/:id', authMiddleware, async (req, res) => {
    if (req.userId !== req.params.id) return res.status(403).json({ error: 'Forbidden' });

    try {
        const user = await User.findOneAndDelete({ id: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });

        await Session.deleteMany({ userId: req.params.id });
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── User Settings Routes ─────────────────────────────────────────────────────

app.get('/api/users/:id/settings', authMiddleware, async (req, res) => {
    if (req.userId !== req.params.id) return res.status(403).json({ error: 'Forbidden' });
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user.settings || { theme: 'dark', language: 'en' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/users/:id/settings', authMiddleware, async (req, res) => {
    if (req.userId !== req.params.id) return res.status(403).json({ error: 'Forbidden' });
    try {
        const { theme, language } = req.body;
        const allowedThemes = ['dark', 'light', 'system', 'ocean', 'forest', 'sunset'];
        const allowedLangs = ['en', 'es', 'fr', 'de', 'hi', 'jp'];

        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.settings) user.settings = { theme: 'dark', language: 'en' };
        if (theme && allowedThemes.includes(theme)) user.settings.theme = theme;
        if (language && allowedLangs.includes(language)) user.settings.language = language;

        await user.save();
        res.json(user.settings);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── Stats / Sessions Routes ──────────────────────────────────────────────────

app.post('/api/stats', authMiddleware, async (req, res) => {
    try {
        const sessionData = req.body;
        
        const newSession = new Session({
            ...sessionData,
            id: `session_${Date.now()}`,
            userId: req.userId,
            date: new Date()
        });
        await newSession.save();

        const user = await User.findOne({ id: req.userId });
        if (user) {
            const count = await Session.countDocuments({ userId: req.userId });
            const prev = user.stats || {};
            
            const newBestWpm = Math.max(prev.bestWpm || 0, sessionData.wpm || 0);
            const newTotalWords = (prev.totalWords || 0) + (sessionData.wordsTyped || 0);
            const newTotalTime = (prev.totalTime || 0) + (sessionData.duration || 0);
            const newAvgWpm = newTotalWords > 0 && newTotalTime > 0
                ? Math.round((newTotalWords / newTotalTime) * 60) : 0;
            const newAccuracy = (((prev.totalAccuracy || 0) * (count - 1)) + (sessionData.accuracy || 0)) / count;
            
            const xpGained = Math.round((sessionData.wpm || 0) * (sessionData.accuracy || 0) / 10)
                + (sessionData.accuracy === 100 ? 50 : 0)
                + ((sessionData.wpm || 0) >= 60 ? 25 : 0);
            const newXp = (prev.xp || 0) + xpGained;

            user.stats = {
                ...prev,
                totalWords: newTotalWords,
                totalTime: newTotalTime,
                bestWpm: newBestWpm,
                averageWpm: newAvgWpm,
                totalAccuracy: Math.round(newAccuracy),
                xp: newXp,
                level: Math.floor(newXp / 1000) + 1,
                lastSessionDate: new Date().toDateString()
            };
            await user.save();
        }

        res.json(newSession);
    } catch (error) {
        console.error("Save Stat Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/stats', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ id: req.userId });
        const userSessions = await Session.find({ userId: req.userId }).sort({ date: -1 });
        const streak = calcStreak(userSessions);
        res.json({ stats: user ? { ...user.stats.toObject(), streak } : null, sessions: userSessions });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── Lessons ──────────────────────────────────────────────────────────────────

app.get('/api/lessons', (req, res) => {
    let lessons = readJSON(LESSONS_FILE);
    const { language, level, category } = req.query;
    if (language) lessons = lessons.filter(l => l.language === language);
    if (level) lessons = lessons.filter(l => l.level === level);
    if (category) lessons = lessons.filter(l => l.category === category);
    res.json(lessons);
});

app.get('/api/lessons/daily', (req, res) => {
    const lessons = readJSON(LESSONS_FILE);
    const today = new Date().toDateString();
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const daily = lessons[seed % lessons.length] || {};
    res.json({ ...daily, isDaily: true, date: today });
});

app.get('/api/lessons/:id', (req, res) => {
    const lessons = readJSON(LESSONS_FILE);
    const lesson = lessons.find(l => l.id === req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
});

// ─── Achievements ─────────────────────────────────────────────────────────────

app.get('/api/achievements', (req, res) => {
    const achievements = readJSON(ACHIEVEMENTS_FILE);
    res.json(achievements);
});

app.post('/api/achievements/unlock', authMiddleware, async (req, res) => {
    try {
        const { achievementId } = req.body;
        if (!achievementId || typeof achievementId !== 'string')
            return res.status(400).json({ error: 'achievementId is required' });

        const allAchievements = readJSON(ACHIEVEMENTS_FILE);
        const achievement = allAchievements.find(a => a.id === achievementId);
        if (!achievement) return res.status(404).json({ error: 'Achievement not found' });

        const user = await User.findOne({ id: req.userId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.stats.achievements) user.stats.achievements = [];
        if (user.stats.achievements.includes(achievementId))
            return res.json({ message: 'Already unlocked', achievement });

        user.stats.achievements.push(achievementId);
        user.stats.xp = (user.stats.xp || 0) + achievement.xpReward;
        user.stats.level = Math.floor(user.stats.xp / 1000) + 1;

        await user.save();
        res.json({ message: 'Achievement unlocked!', achievement, xpAwarded: achievement.xpReward });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/achievements/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ id: req.userId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const allAchievements = readJSON(ACHIEVEMENTS_FILE);
        const unlockedIds = user.stats.achievements || [];
        const result = allAchievements.map(a => ({
            ...a,
            unlocked: unlockedIds.includes(a.id),
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── Leaderboard ──────────────────────────────────────────────────────────────

app.get('/api/leaderboard', async (req, res) => {
    try {
        const users = await User.find({ "stats.bestWpm": { $gt: 0 } }).lean();
        
        const leaderboardPromises = users.map(async (user) => {
            const userSessions = await Session.find({ userId: user.id }).sort({ wpm: -1 }).lean();
            const bestSession = userSessions[0];
            return {
                id: user.id,
                username: user.name,
                wpm: user.stats.bestWpm,
                accuracy: user.stats.totalAccuracy,
                tests: userSessions.length,
                level: user.stats.level || 1,
                streak: calcStreak(userSessions),
                bestSessionDate: bestSession ? bestSession.date : null,
            };
        });

        let leaderboard = await Promise.all(leaderboardPromises);
        leaderboard.sort((a, b) => b.wpm - a.wpm);
        
        res.json(leaderboard.slice(0, 50));
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── Socket.io — Live Leaderboard ─────────────────────────────────────────────
let livePlayers = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('updateScore', (data) => {
        livePlayers[socket.id] = { ...data, socketId: socket.id };
        io.emit('liveLeaderboard', Object.values(livePlayers).sort((a, b) => (b.wpm || 0) - (a.wpm || 0)));
    });

    socket.on('disconnect', () => {
        delete livePlayers[socket.id];
        io.emit('liveLeaderboard', Object.values(livePlayers).sort((a, b) => (b.wpm || 0) - (a.wpm || 0)));
        console.log('User disconnected:', socket.id);
    });
});

// ─── Start ───────────────────────────────────────────────────────────────────

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("⚠️  WARNING: MONGO_URI is not defined in .env! Cannot connect to database.");
            console.warn("Please create a .env file and set MONGO_URI.");
        } else {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('✅ Connected to MongoDB successfully');
        }

        server.listen(PORT, () => {
            console.log(`✅ Backend server running at http://localhost:${PORT}`);
            console.log(`📚 Endpoints ready:`);
            console.log(`   Auth:         POST /api/auth/register | POST /api/auth/login | GET /api/auth/me`);
            console.log(`   Users:        GET/PUT/DELETE /api/users/:id`);
            console.log(`   Settings:     GET/PUT /api/users/:id/settings`);
            console.log(`   Stats:        GET/POST /api/stats`);
            console.log(`   Lessons:      GET /api/lessons | GET /api/lessons/daily | GET /api/lessons/:id`);
            console.log(`   Achievements: GET /api/achievements | POST /api/achievements/unlock | GET /api/achievements/user`);
            console.log(`   Leaderboard:  GET /api/leaderboard`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
