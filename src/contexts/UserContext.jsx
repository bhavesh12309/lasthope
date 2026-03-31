import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Query } from 'appwrite';
import { account, databases, ID } from '../appwrite';

const DATABASE_ID   = '69cb5ca30002d53de5b4';
const COLLECTION_ID = 'user';

const UserContext = createContext(undefined);

const initialStats = {
  totalWords: 0,
  totalTime: 0,
  bestWpm: 0,
  averageWpm: 0,
  totalAccuracy: 0,
  level: 1,
  xp: 0,
  achievements: [],
  dailyGoal: 100,
  dailyProgress: 0,
  lastSessionDate: new Date().toDateString(),
  streak: 0,
};

// ── Fetch this user's session documents from Appwrite ────────────────────────
const fetchUserSessions = async (userId) => {
  const res = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_ID,
    [Query.equal('userId', userId), Query.orderDesc('$createdAt'), Query.limit(100)]
  );
  return res.documents.map(doc => ({
    id:         doc.$id,
    date:       doc.date       || doc.$createdAt,
    wpm:        doc.wpm        || 0,
    accuracy:   doc.accuracy   || 0,
    wordsTyped: doc.wordsTyped || 0,
    duration:   doc.duration   || 0,
    mistakes:   doc.mistakes   || 0,
    lessonType: doc.lessonType || '',
    weakKeys:   doc.weakKeys   || [],
  }));
};

// ── Derive stats from an array of session documents ──────────────────────────
const deriveStats = (docs) => {
  if (!docs.length) return initialStats;
  const totalWords = docs.reduce((s, d) => s + (d.wordsTyped || 0), 0);
  const totalTime  = docs.reduce((s, d) => s + (d.duration   || 0), 0);
  const bestWpm    = Math.max(...docs.map(d => d.wpm || 0));
  const avgWpm     = totalTime > 0 ? Math.round((totalWords / totalTime) * 60) : 0;
  const avgAcc     = Math.round(docs.reduce((s, d) => s + (d.accuracy || 0), 0) / docs.length);
  const xp         = docs.reduce((s, d) => s + Math.round((d.wpm || 0) * (d.accuracy || 0) / 10), 0);
  return {
    ...initialStats,
    totalWords,
    totalTime,
    bestWpm,
    averageWpm:    avgWpm,
    totalAccuracy: avgAcc,
    xp,
    level: Math.floor(xp / 1000) + 1,
  };
};

// ── Provider ─────────────────────────────────────────────────────────────────
export const UserProvider = ({ children }) => {
  const [stats, setStats]                     = useState(initialStats);
  const [sessions, setSessions]               = useState([]);
  const [currentUser, setCurrentUser]         = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading]         = useState(true);
  const [dataLoading, setDataLoading]         = useState(false);
  const [dataError, setDataError]             = useState(null);

  // Load all sessions for a user and recompute stats
  const loadUserData = useCallback(async (user) => {
    setDataLoading(true);
    setDataError(null);
    try {
      const docs = await fetchUserSessions(user.$id);
      setSessions(docs);
      setStats(deriveStats(docs));
    } catch (e) {
      console.error('❌ Appwrite fetch error:', e);
      setDataError(`${e.message} (code: ${e.code || 'unknown'})`);
      setSessions([]);
      setStats(initialStats);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // On app start: check if there is an active Appwrite session
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
        setIsAuthenticated(true);
        await loadUserData(user);
      } catch {
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkUser();
  }, [loadUserData]);

  // Called from Login.jsx after createEmailPasswordSession succeeds
  const login = useCallback(async (_id, user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    await loadUserData(user);
  }, [loadUserData]);

  // Logout: delete Appwrite session + reset all local state
  const logout = useCallback(async () => {
    try { await account.deleteSession('current'); } catch {}
    setCurrentUser(null);
    setIsAuthenticated(false);
    setSessions([]);
    setStats(initialStats);
  }, []);

  // Called when a typing test finishes
  const addSession = useCallback((sessionData) => {
    const now = new Date().toISOString();
    const newSession = { ...sessionData, id: Date.now().toString(), date: now };

    // Update local state immediately so Dashboard reflects the new session
    setSessions(prev => [newSession, ...prev]);
    setStats(prev => {
      const newTotalWords = prev.totalWords + (sessionData.wordsTyped || 0);
      const newTotalTime  = prev.totalTime  + (sessionData.duration   || 0);
      const newBestWpm    = Math.max(prev.bestWpm, sessionData.wpm || 0);
      const newXp         = prev.xp + Math.round((sessionData.wpm || 0) * (sessionData.accuracy || 0) / 10);
      return {
        ...prev,
        totalWords:  newTotalWords,
        totalTime:   newTotalTime,
        bestWpm:     newBestWpm,
        averageWpm:  newTotalTime > 0 ? Math.round((newTotalWords / newTotalTime) * 60) : 0,
        xp:          newXp,
        level:       Math.floor(newXp / 1000) + 1,
      };
    });

    // Persist to Appwrite in background (only if logged in)
    if (currentUser) {
      databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        userId:     currentUser.$id,
        email:      currentUser.email,
        date:       now,
        wpm:        sessionData.wpm        || 0,
        accuracy:   sessionData.accuracy   || 0,
        wordsTyped: sessionData.wordsTyped || 0,
        duration:   sessionData.duration   || 0,
        mistakes:   sessionData.mistakes   || 0,
        lessonType: sessionData.lessonType || '',
      })
        .then(() => console.log('✅ Session saved to Appwrite'))
        .catch(e  => console.warn('Appwrite save error:', e.message));
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{
      stats, sessions, currentUser, isAuthenticated, authLoading,
      dataLoading, dataError,
      login, logout, addSession,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};