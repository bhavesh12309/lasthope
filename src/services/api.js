import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    timeout: 8000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = (name, email, password) =>
    api.post('/api/auth/register', { name, email, password });

export const loginUser = (email, password) =>
    api.post('/api/auth/login', { email, password });

export const getMe = () => api.get('/api/auth/me');

// ─── Users CRUD ───────────────────────────────────────────────────────────────
export const getUser = (id) => api.get(`/api/users/${id}`);

export const updateUser = (id, data) => api.put(`/api/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/api/users/${id}`);

// ─── User Settings ────────────────────────────────────────────────────────────
export const getUserSettings = (id) => api.get(`/api/users/${id}/settings`);

export const updateUserSettings = (id, settings) =>
    api.put(`/api/users/${id}/settings`, settings);

// ─── Stats / Sessions ─────────────────────────────────────────────────────────
export const postSession = (sessionData) => api.post('/api/stats', sessionData);

export const getSessions = () => api.get('/api/stats');

// ─── Lessons ──────────────────────────────────────────────────────────────────
export const getLessons = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.language) params.append('language', filters.language);
    if (filters.level) params.append('level', filters.level);
    if (filters.category) params.append('category', filters.category);
    return api.get(`/api/lessons?${params.toString()}`);
};

export const getDailyLesson = () => api.get('/api/lessons/daily');

export const getLesson = (id) => api.get(`/api/lessons/${id}`);

// ─── Achievements ─────────────────────────────────────────────────────────────
export const getAchievements = () => api.get('/api/achievements');

export const getUserAchievements = () => api.get('/api/achievements/user');

export const unlockAchievement = (achievementId) =>
    api.post('/api/achievements/unlock', { achievementId });

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export const getLeaderboard = () => api.get('/api/leaderboard');

export default api;
