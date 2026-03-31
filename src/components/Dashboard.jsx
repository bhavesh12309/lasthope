import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Zap, Target, AlertCircle, Award, Star } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Dashboard = () => {
  const { stats, sessions, dataLoading, dataError } = useUser();
  const [dateRange, setDateRange] = useState('week');

  // Filter sessions by selected date range
  const daysMap = { week: 7, month: 30, quarter: 90, year: 365, all: 36500 };
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (daysMap[dateRange] || 7));
  const filteredSessions = (sessions || []).filter(s => new Date(s.date) >= cutoff);

  // WPM / Accuracy per-day chart
  const buildChartData = () => {
    if (filteredSessions.length === 0) return [];
    const byDay = {};
    filteredSessions.forEach(s => {
      const day = new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      if (!byDay[day]) byDay[day] = { wpmSum: 0, accSum: 0, count: 0, mistakes: 0 };
      byDay[day].wpmSum  += s.wpm      || 0;
      byDay[day].accSum  += s.accuracy || 0;
      byDay[day].count   += 1;
      byDay[day].mistakes += s.mistakes || 0;
    });
    return Object.entries(byDay).map(([date, d]) => ({
      date,
      wpm:      Math.round(d.wpmSum / d.count),
      accuracy: Math.round(d.accSum / d.count),
      mistakes: d.mistakes,
    }));
  };
  const chartData = buildChartData();

  // WPM distribution buckets
  const buildWpmDistribution = () => {
    const buckets = { '0-30': 0, '30-50': 0, '50-70': 0, '70-90': 0, '90+': 0 };
    filteredSessions.forEach(s => {
      const w = s.wpm || 0;
      if (w < 30) buckets['0-30']++;
      else if (w < 50) buckets['30-50']++;
      else if (w < 70) buckets['50-70']++;
      else if (w < 90) buckets['70-90']++;
      else buckets['90+']++;
    });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  };
  const wpmDist = buildWpmDistribution();

  // Weak key aggregation
  const buildMistakeData = () => {
    const charMistakes = {};
    filteredSessions.forEach(s => {
      if (Array.isArray(s.weakKeys)) {
        s.weakKeys.forEach(k => { charMistakes[k] = (charMistakes[k] || 0) + 1; });
      }
    });
    return Object.entries(charMistakes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([char, mistakes]) => ({ char, mistakes }));
  };
  const mistakeData = buildMistakeData();

  const totalTests   = filteredSessions.length;
  const avgWpm       = totalTests > 0 ? Math.round(filteredSessions.reduce((s, x) => s + (x.wpm      || 0), 0) / totalTests) : 0;
  const avgAccuracy  = totalTests > 0 ? Math.round(filteredSessions.reduce((s, x) => s + (x.accuracy || 0), 0) / totalTests) : 0;
  const avgMistakes  = totalTests > 0 ? (filteredSessions.reduce((s, x) => s + (x.mistakes || 0), 0) / totalTests).toFixed(1) : 0;

  const kpis = [
    { label: 'Best WPM',      value: stats.bestWpm,                  icon: Zap,         color: 'bg-blue-500',   subtext: 'All time' },
    { label: 'Avg Accuracy',  value: `${avgAccuracy}%`,              icon: Target,      color: 'bg-green-500',  subtext: 'Selected period' },
    { label: 'Total Tests',   value: totalTests,                     icon: TrendingUp,  color: 'bg-purple-500', subtext: 'Selected period' },
    { label: 'Avg Mistakes',  value: avgMistakes,                    icon: AlertCircle, color: 'bg-orange-500', subtext: 'Per test' },
    { label: 'Level',         value: stats.level,                    icon: Star,        color: 'bg-yellow-500', subtext: `${stats.xp} XP` },
    { label: 'Achievements',  value: stats.achievements?.length || 0, icon: Award,      color: 'bg-pink-500',   subtext: 'Unlocked' },
  ];

  const KPICard = ({ kpi }) => {
    const Icon = kpi.icon;
    return (
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className={`${kpi.color} p-3 rounded-lg`}>
            <Icon className="text-white" size={22} />
          </div>
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{kpi.label}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
        <p className="text-xs text-gray-500">{kpi.subtext}</p>
      </div>
    );
  };

  const isEmpty = filteredSessions.length === 0;

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading your stats…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── Appwrite error banner ── */}
      {dataError && (
        <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-800 px-5 py-4 rounded-lg mb-6 text-sm">
          <p className="font-bold mb-1">⚠️ Could not load your stats from Appwrite</p>
          <p className="font-mono text-xs break-all">{dataError}</p>
          <p className="mt-2 text-xs">
            Most likely cause: <strong>missing index on <code>userId</code></strong>.
            Go to <strong>Appwrite Console → Databases → your collection → Indexes</strong> and add an index on <code>userId</code> (Key type: Key).
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Dashboard</h1>
            <p className="text-gray-500 text-sm">Your personal typing performance stats</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow text-sm">
            <span className="text-gray-500">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="outline-none font-medium text-gray-800"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi, idx) => <KPICard key={idx} kpi={kpi} />)}
      </div>

      {isEmpty ? (
        <div className="bg-white rounded-lg shadow p-16 text-center">
          <TrendingUp size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            {dataError ? 'Stats unavailable' : 'No sessions yet'}
          </h2>
          <p className="text-gray-400">
            {dataError
              ? 'Fix the Appwrite error shown above, then refresh the page.'
              : 'Complete a typing test to see your stats here.'}
          </p>
        </div>
      ) : (
        <>
          {/* WPM + Accuracy Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">WPM Over Time</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="wpm" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWpm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Accuracy Over Time</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} domain={[80, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* WPM Distribution + Weak Keys */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">WPM Distribution</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={wpmDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="range" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Weak Keys</h2>
              {mistakeData.length === 0 ? (
                <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">
                  No weak key data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={mistakeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <YAxis type="category" dataKey="char" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Bar dataKey="mistakes" fill="#ef4444" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Sessions Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">WPM</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Accuracy</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Words</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Mistakes</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredSessions].reverse().slice(0, 15).map((s, idx) => (
                    <tr key={s.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{s.wpm || 0}</td>
                      <td className={`px-4 py-3 font-semibold ${(s.accuracy || 0) >= 95 ? 'text-green-600' : (s.accuracy || 0) >= 85 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {s.accuracy || 0}%
                      </td>
                      <td className="px-4 py-3 text-gray-600">{s.wordsTyped || 0}</td>
                      <td className="px-4 py-3 text-gray-600">{s.mistakes || 0}</td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{s.lessonType || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;