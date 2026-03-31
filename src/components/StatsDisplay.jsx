import React, { useState, useEffect } from 'react';
import { Clock, Zap, Target, TrendingUp, Award, Trophy, Flame, Star, Sparkles, Activity, Gauge } from 'lucide-react';

const StatsDisplay = ({ 
  stats = { wpm: 45, accuracy: 92, mistakes: 3, charactersTyped: 225 }, 
  timeElapsed = 120000 
}) => {
  const [animatedStats, setAnimatedStats] = useState({
    wpm: 0,
    accuracy: 0,
    mistakes: 0,
    charactersTyped: 0
  });
  const [streakCount, setStreakCount] = useState(0);
  const [isOnFire, setIsOnFire] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    const animateValue = (key, targetValue) => {
      const startValue = animatedStats[key];
      const difference = targetValue - startValue;
      const steps = 30;
      const stepValue = difference / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const easeOut = 1 - Math.pow(1 - currentStep / steps, 3);
        const newValue = startValue + (stepValue * steps * easeOut);
        
        setAnimatedStats(prev => ({
          ...prev,
          [key]: currentStep === steps ? targetValue : Math.round(newValue)
        }));

        if (currentStep === steps) {
          clearInterval(timer);
        }
      }, 30);
    };

    Object.keys(stats).forEach(key => {
      if (stats[key] !== animatedStats[key]) {
        animateValue(key, stats[key]);
      }
    });
  }, [stats, animatedStats]);

  useEffect(() => {
    if (stats.accuracy >= 95 && stats.wpm >= 40) {
      setStreakCount(prev => prev + 1);
      setIsOnFire(true);
      setPulseIntensity(1);
    } else {
      setStreakCount(0);
      setIsOnFire(false);
      setPulseIntensity(0);
    }
  }, [stats.accuracy, stats.wpm]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 95) return 'text-emerald-500';
    if (accuracy >= 85) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getAccuracyGradient = (accuracy) => {
    if (accuracy >= 95) return 'from-emerald-500/30 via-emerald-400/20 to-teal-600/20';
    if (accuracy >= 85) return 'from-amber-500/30 via-amber-400/20 to-orange-600/20';
    return 'from-rose-500/30 via-pink-400/20 to-red-600/20';
  };

  const getWpmColor = (wpm) => {
    if (wpm >= 60) return 'text-emerald-500';
    if (wpm >= 40) return 'text-amber-500';
    if (wpm >= 20) return 'text-orange-500';
    return 'text-rose-500';
  };

  const getWpmGradient = (wpm) => {
    if (wpm >= 60) return 'from-emerald-500/30 via-emerald-400/20 to-teal-600/20';
    if (wpm >= 40) return 'from-amber-500/30 via-amber-400/20 to-orange-600/20';
    if (wpm >= 20) return 'from-orange-500/30 via-orange-400/20 to-red-600/20';
    return 'from-rose-500/30 via-pink-400/20 to-red-600/20';
  };

  const getPerformanceLevel = () => {
    if (stats.wpm >= 60 && stats.accuracy >= 95) return { level: 'Expert', icon: Trophy, color: 'text-yellow-500', bgColor: 'from-yellow-500/30 to-amber-600/20' };
    if (stats.wpm >= 40 && stats.accuracy >= 85) return { level: 'Advanced', icon: Star, color: 'text-blue-500', bgColor: 'from-blue-500/30 to-cyan-600/20' };
    if (stats.wpm >= 20 && stats.accuracy >= 70) return { level: 'Intermediate', icon: Target, color: 'text-green-500', bgColor: 'from-green-500/30 to-emerald-600/20' };
    return { level: 'Beginner', icon: Zap, color: 'text-gray-400', bgColor: 'from-gray-500/20 to-slate-600/20' };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;
  
  const charsPerMinute = Math.round((stats.charactersTyped / (timeElapsed / 60000)) || 0);
  const keystrokeRate = Math.round(((stats.charactersTyped / (timeElapsed / 1000)) || 0) * 10) / 10;
  const performanceScore = Math.round(((stats.wpm * stats.accuracy) / 100) || 0);

  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8">
      {/* Performance Level & Streak - Enhanced */}
      {(streakCount > 0 || stats.wpm > 0) && (
        <div className="flex flex-wrap items-center justify-center gap-4 pb-4 border-b border-white/10">
          <div className={`relative flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${performance.bgColor} backdrop-blur-xl border border-white/20 shadow-2xl hover:border-white/40 transition-all duration-500 hover:scale-105`}>
            <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 bg-white/5 transition-opacity"></div>
            <PerformanceIcon className={`w-6 h-6 ${performance.color} mr-3 animate-pulse`} />
            <span className={`font-bold text-lg ${performance.color}`}>{performance.level}</span>
          </div>
          
          {isOnFire && (
            <div className="relative flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/40 to-red-600/40 backdrop-blur-xl border border-orange-400/50 shadow-2xl animate-pulse hover:shadow-orange-500/50">
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
              <Flame className="relative w-6 h-6 text-orange-400 mr-3 animate-bounce" />
              <span className="relative font-bold text-lg text-orange-300">On Fire!</span>
            </div>
          )}

          {streakCount > 1 && (
            <div className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-600/30 backdrop-blur-xl border border-purple-400/30 shadow-lg">
              <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
              <span className="font-semibold text-purple-300 text-sm">×{streakCount} Streak</span>
            </div>
          )}
        </div>
      )}

      {/* Main Stats Grid - Enhanced */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {/* WPM */}
        <div className={`group relative bg-gradient-to-br ${getWpmGradient(stats.wpm)} backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/40 transform hover:scale-110 transition-all duration-300 cursor-pointer`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-br ${getWpmGradient(stats.wpm)} border border-white/30 shadow-lg`}>
                <Gauge className={`w-6 h-6 ${getWpmColor(stats.wpm)}`} />
              </div>
            </div>
            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 opacity-80">
              Speed
            </div>
            <div className={`text-4xl font-black ${getWpmColor(stats.wpm)} transition-all duration-500 drop-shadow-lg`}>
              {animatedStats.wpm}
            </div>
            <div className="text-xs text-gray-400 mt-1">words/min</div>
            <div className="mt-4 space-y-2">
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-white/10">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getWpmGradient(stats.wpm)} shadow-lg transition-all duration-1000`}
                  style={{ width: `${Math.min((stats.wpm / 80) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 text-center">Peak: {stats.wpm}/80</div>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className={`group relative bg-gradient-to-br ${getAccuracyGradient(stats.accuracy)} backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/40 transform hover:scale-110 transition-all duration-300 cursor-pointer`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-br ${getAccuracyGradient(stats.accuracy)} border border-white/30 shadow-lg`}>
                <Target className={`w-6 h-6 ${getAccuracyColor(stats.accuracy)}`} />
              </div>
            </div>
            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 opacity-80">
              Accuracy
            </div>
            <div className={`text-4xl font-black ${getAccuracyColor(stats.accuracy)} transition-all duration-500 drop-shadow-lg`}>
              {animatedStats.accuracy}<span className="text-2xl">%</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">precision</div>
            <div className="mt-4 space-y-2">
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-white/10">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getAccuracyGradient(stats.accuracy)} shadow-lg transition-all duration-1000`}
                  style={{ width: `${stats.accuracy}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 text-center">{stats.mistakes} mistakes</div>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="group relative bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/40 transform hover:scale-110 transition-all duration-300 cursor-pointer">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-white/30 shadow-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 opacity-80">
              Time
            </div>
            <div className="text-4xl font-black text-blue-400 transition-all duration-500 font-mono drop-shadow-lg">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-xs text-gray-400 mt-1">elapsed</div>
            <div className="mt-4 flex justify-center">
              <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs text-blue-300">
                {Math.floor(timeElapsed / 1000)}s total
              </div>
            </div>
          </div>
        </div>

        {/* Mistakes */}
        <div className="group relative bg-gradient-to-br from-rose-500/30 via-rose-400/20 to-red-600/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/40 transform hover:scale-110 transition-all duration-300 cursor-pointer">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-rose-500/30 to-red-600/30 border border-white/30 shadow-lg">
                <TrendingUp className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 opacity-80">
              Mistakes
            </div>
            <div className="text-4xl font-black text-rose-400 transition-all duration-500 drop-shadow-lg">
              {animatedStats.mistakes}
            </div>
            <div className="text-xs text-gray-400 mt-1">errors</div>
            <div className="mt-4 flex justify-center">
              <div className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-xs text-rose-300">
                {stats.charactersTyped > 0 ? ((stats.mistakes / stats.charactersTyped) * 100).toFixed(1) : 0}% error rate
              </div>
            </div>
          </div>
        </div>

        {/* Characters */}
        <div className="group relative bg-gradient-to-br from-purple-500/30 via-purple-400/20 to-violet-600/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/40 transform hover:scale-110 transition-all duration-300 cursor-pointer">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-600/30 border border-white/30 shadow-lg">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 opacity-80">
              Characters
            </div>
            <div className="text-4xl font-black text-purple-400 transition-all duration-500 drop-shadow-lg">
              {animatedStats.charactersTyped}
            </div>
            <div className="text-xs text-gray-400 mt-1">typed</div>
            <div className="mt-4 flex justify-center">
              <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs text-purple-300">
                {stats.charactersTyped - stats.mistakes} correct
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Performance Metrics */}
      {stats.charactersTyped > 50 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-gradient-to-br from-cyan-500/30 via-cyan-400/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/40 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-3">
              <Activity className="w-5 h-5 text-cyan-400 mr-2" />
              <div className="text-sm font-bold text-gray-300 uppercase tracking-wider opacity-80">Chars/Min</div>
            </div>
            <div className="text-3xl font-black text-cyan-400 drop-shadow-lg">{charsPerMinute}</div>
            <div className="mt-2 h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000" style={{ width: `${Math.min((charsPerMinute / 500) * 100, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-teal-500/30 via-teal-400/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/40 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-teal-400 mr-2" />
              <div className="text-sm font-bold text-gray-300 uppercase tracking-wider opacity-80">Keystroke Rate</div>
            </div>
            <div className="text-3xl font-black text-teal-400 drop-shadow-lg">{keystrokeRate}</div>
            <div className="text-xs text-gray-400 mt-2">keystrokes per second</div>
          </div>

          <div className="group bg-gradient-to-br from-indigo-500/30 via-indigo-400/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/40 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-3">
              <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
              <div className="text-sm font-bold text-gray-300 uppercase tracking-wider opacity-80">Performance</div>
            </div>
            <div className="text-3xl font-black text-indigo-400 drop-shadow-lg">{performanceScore}</div>
            <div className="text-xs text-gray-400 mt-2">overall score</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDisplay;