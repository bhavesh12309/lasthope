import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, Zap, Target, Trophy, Users, BarChart3, 
  Brain, Skull, Clock, Crown, LogIn, ArrowRight, Sparkles
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const Homepage = () => {
  const { stats, isAuthenticated, currentUser } = useUser();
  const { theme } = useTheme();

  const modes = [
    {
      to: '/typing/time-session',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/25',
      border: 'hover:border-blue-500/50',
      title: 'Timed Sessions',
      desc: 'Race against the clock. 30s to 10 minutes.',
      tags: ['30s', '1min', '5min', '10min'],
    },
    {
      to: '/typing/word-count',
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/25',
      border: 'hover:border-emerald-500/50',
      title: 'Word Count',
      desc: 'Hit your word target, no time pressure.',
      tags: ['10', '25', '50', '100', '200 words'],
    },
    {
      to: '/typing/endless',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/25',
      border: 'hover:border-purple-500/50',
      title: 'Endless Mode',
      desc: 'Flow state. No limits, pure zen typing.',
      tags: ['Adaptive', 'Zen', 'Endurance'],
    },
  ];

  const features = [
    { icon: BarChart3, color: 'bg-blue-500', title: 'Progress Charts', desc: 'Visual WPM & accuracy trends over time.' },
    { icon: Target, color: 'bg-emerald-500', title: 'Weak Key Analysis', desc: 'Pinpoint problem keys and target them.' },
    { icon: Clock, color: 'bg-purple-500', title: 'Session History', desc: 'Full logs of every practice session.' },
    { icon: Trophy, color: 'bg-amber-500', title: 'Achievements', desc: 'Unlock badges, earn XP and level up.' },
  ];

  const quickActions = [
    { title: 'Smart Practice', desc: 'AI-recommended lessons', icon: Brain, color: 'from-blue-500 to-indigo-600', link: '/smart-practice' },
    { title: 'Zombie Game', desc: 'Type to survive', icon: Skull, color: 'from-red-500 to-rose-600', link: '/game' },
    { title: 'Custom Lesson', desc: 'Practice your own text', icon: Target, color: 'from-emerald-500 to-teal-600', link: '/custom' },
    { title: 'Leaderboard', desc: 'Compete globally', icon: Crown, color: 'from-amber-500 to-orange-500', link: '/leaderboard' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/60 to-pink-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/20" />
        <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>The #1 typing practice platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="gradient-text">Master Your</span>
            <br />
            <span className="text-gray-900 dark:text-white">Typing Speed</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {isAuthenticated
              ? `Welcome back, ${currentUser?.name}! Ready to beat your best of ${stats.bestWpm} WPM?`
              : 'Track progress, earn achievements, and become a typing champion with our gamified platform.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/typing"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-base hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 shadow-xl shadow-blue-500/30">
              <Play className="w-5 h-5" />
              <span>Start Typing</span>
            </Link>
            {!isAuthenticated && (
              <Link to="/login"
                className="inline-flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 shadow-lg">
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
            <Link to="/dashboard"
              className="inline-flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 shadow-lg">
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Stats strip */}
          {stats.totalWords > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mt-12">
              {[
                { label: 'Best WPM', value: stats.bestWpm, color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Accuracy', value: `${stats.totalAccuracy}%`, color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Level', value: stats.level, color: 'text-purple-600 dark:text-purple-400' },
                { label: 'Achievements', value: stats.achievements.length, color: 'text-amber-600 dark:text-amber-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass rounded-xl px-4 py-3 text-center">
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Practice Modes ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/60 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Practice Modes</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Choose the mode that fits your goal today.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {modes.map((mode) => (
              <Link key={mode.to} to={mode.to}
                className={`group bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700/50 ${mode.border} hover:shadow-xl ${mode.shadow} transition-all duration-300`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${mode.color} rounded-xl mb-5 shadow-lg ${mode.shadow} group-hover:scale-110 transition-transform duration-200`}>
                  <mode.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{mode.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">{mode.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {mode.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{t}</span>
                  ))}
                </div>
                <div className="flex items-center mt-5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200">
                  Start <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Analytics Features ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Advanced Analytics</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Detailed insights to accelerate your improvement.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/40 hover:shadow-lg transition-all duration-200 group">
                <div className={`inline-flex items-center justify-center w-11 h-11 ${f.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Access ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/60 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Quick Access</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Jump straight into your preferred mode.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickActions.map((a) => (
              <Link key={a.title} to={a.link}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${a.color} rounded-xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <a.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{a.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl p-12 text-center shadow-2xl shadow-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23fff fill-opacity=0.07%3E%3Ccircle cx=30 cy=30 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Become a Typing Master?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who've leveled up their typing speed and accuracy.
              </p>
              <Link to="/typing"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-base hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl">
                <Play className="w-5 h-5" />
                <span>Start Your Journey</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;