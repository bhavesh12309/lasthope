import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, Sun, Moon, RefreshCw } from 'lucide-react';
import { Query } from 'appwrite';
import { databases } from '../appwrite';

const DATABASE_ID   = '69cb5ca30002d53de5b4';
const COLLECTION_ID = 'user';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch up to 500 session docs, ordered by WPM descending
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.orderDesc('wpm'), Query.limit(500)]
      );

      // Group by userId, keep the best WPM session per user
      const byUser = {};
      res.documents.forEach(doc => {
        const uid = doc.userId;
        if (!uid) return;
        if (!byUser[uid] || (doc.wpm || 0) > byUser[uid].wpm) {
          byUser[uid] = {
            id:              uid,
            username:        doc.email?.split('@')[0] || 'Anonymous',
            wpm:             doc.wpm        || 0,
            accuracy:        doc.accuracy   || 0,
            tests:           0,
            bestSessionDate: doc.date       || doc.$createdAt,
          };
        }
        byUser[uid].tests += 1;
      });

      const sorted = Object.values(byUser)
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 50);

      setScores(sorted);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load leaderboard. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);


  const getFilteredScores = () => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    return scores.filter(score => {
      if (filterPeriod === 'all' || !score.bestSessionDate) return true;
      const ts = new Date(score.bestSessionDate).getTime();
      if (filterPeriod === 'today') return now - ts < day;
      if (filterPeriod === 'week') return now - ts < day * 7;
      if (filterPeriod === 'month') return now - ts < day * 30;
      return true;
    });
  };

  const filteredScores = getFilteredScores();
  const topPlayer = filteredScores[0];
  const avgWpm = filteredScores.length > 0
    ? (filteredScores.reduce((sum, s) => sum + (s.wpm || 0), 0) / filteredScores.length).toFixed(1)
    : 0;

  const bg = darkMode
    ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
    : 'bg-gradient-to-br from-white via-blue-50 to-slate-50';

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bg}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className={darkMode ? 'text-slate-300' : 'text-gray-600'}>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bg} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 justify-center">
              <TrendingUp size={32} className="text-blue-400" />
              <h1 className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? 'from-blue-400 to-cyan-300' : 'from-blue-600 to-cyan-600'
                }`}>
                Typing Leaderboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchLeaderboard}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-blue-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>
          <p className={`text-center text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Compete with players worldwide
          </p>
          {lastUpdated && (
            <p className={`text-center text-xs mt-1 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-lg mb-6 text-sm">
            <p className="font-semibold mb-1">Connection Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Players', value: scores.length, color: 'text-blue-500' },
            { label: 'Showing', value: filteredScores.length, color: 'text-cyan-500' },
            { label: 'Average WPM', value: avgWpm, color: 'text-green-500' },
            { label: 'Top WPM', value: topPlayer?.wpm || 0, color: 'text-yellow-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-lg p-4 border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'today', 'week', 'month'].map(period => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-4 py-2 rounded font-semibold transition capitalize whitespace-nowrap ${filterPeriod === period
                  ? 'bg-blue-500 text-white'
                  : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
            >
              {period === 'all' ? 'All Time' : period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className={`rounded-lg overflow-hidden border shadow-2xl ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'
          }`}>
          {filteredScores.length === 0 ? (
            <div className="p-16 text-center">
              <TrendingUp size={48} className={`mx-auto mb-4 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={`text-lg mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {error ? 'Could not load scores.' : 'No scores yet.'}
              </p>
              <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {error ? 'Start the backend server to see real scores.' : 'Complete a typing test and log in to appear here!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode
                      ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700'
                      : 'bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200'
                    }`}>
                    {['Rank', 'Player', 'Best WPM', 'Accuracy', 'Tests'].map(col => (
                      <th key={col} className={`px-4 md:px-6 py-4 text-left font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.map((score, idx) => {
                    const isTopRank = idx < 3;
                    const darkColors = ['from-yellow-500/20 to-yellow-600/10', 'from-slate-400/20 to-slate-500/10', 'from-orange-600/20 to-orange-700/10'];
                    const lightColors = ['from-yellow-100 to-yellow-50', 'from-slate-100 to-slate-50', 'from-orange-100 to-orange-50'];
                    return (
                      <tr key={score.id} className={`border-b transition-colors ${isTopRank
                          ? `bg-gradient-to-r ${darkMode ? darkColors[idx] : lightColors[idx]}`
                          : darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                        } ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <td className={`px-4 md:px-6 py-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <div className="flex items-center gap-2">
                            {idx === 0 && <Crown size={18} className="text-yellow-500" />}
                            <span className="text-lg font-bold">
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                            </span>
                          </div>
                        </td>
                        <td className={`px-4 md:px-6 py-4 font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {score.username}
                        </td>
                        <td className={`px-4 md:px-6 py-4 font-bold text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {score.wpm}
                        </td>
                        <td className={`px-4 md:px-6 py-4 font-semibold ${(score.accuracy || 0) >= 95
                            ? darkMode ? 'text-green-400' : 'text-green-600'
                            : (score.accuracy || 0) >= 85
                              ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                              : darkMode ? 'text-orange-400' : 'text-orange-600'
                          }`}>
                          {score.accuracy}%
                        </td>
                        <td className={`px-4 md:px-6 py-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {score.tests}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}