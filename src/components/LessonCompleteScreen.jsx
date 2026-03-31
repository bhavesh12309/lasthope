import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ChevronRight, Home, Zap, Target, Clock, X as XIcon, Star, Award } from 'lucide-react';

/* ─── XP formula ─────────────────────────────────────── */
const calcXP = (wpm, accuracy, mistakes) => {
  const base = Math.round(wpm * (accuracy / 100));
  const bonus = accuracy === 100 ? 25 : accuracy >= 95 ? 10 : 0;
  const penalty = Math.max(0, mistakes * 2);
  return Math.max(0, base + bonus - penalty);
};

/* ─── Star rating ────────────────────────────────────── */
const getStars = (wpm, accuracy, wpmTarget) => {
  const wpmRatio = wpm / (wpmTarget || 30);
  if (accuracy >= 98 && wpmRatio >= 1) return 3;
  if (accuracy >= 90 && wpmRatio >= 0.8) return 2;
  return 1;
};

/* ─── Confetti particle ──────────────────────────────── */
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f97316'];
const Particle = ({ style }) => (
  <div
    className="absolute w-2 h-2 rounded-sm pointer-events-none"
    style={style}
  />
);

const Confetti = ({ active }) => {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: COLORS[i % COLORS.length],
    delay: `${Math.random() * 0.6}s`,
    duration: `${0.9 + Math.random() * 0.8}s`,
    size: `${6 + Math.random() * 6}px`,
    rotate: `${Math.random() * 360}deg`,
  }));

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <Particle
          key={p.id}
          style={{
            left: p.left,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate})`,
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Animated XP counter ────────────────────────────── */
const XPCounter = ({ target }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev + step >= target) { clearInterval(timer); return target; }
        return prev + step;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
};

/* ─── Star display ───────────────────────────────────── */
const StarRow = ({ stars }) => {
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (lit >= stars) return;
    const t = setTimeout(() => setLit((p) => p + 1), 350);
    return () => clearTimeout(t);
  }, [lit, stars]);

  return (
    <div className="flex gap-3 justify-center mb-6">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`transition-all duration-500 ${lit >= n ? 'scale-125 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]' : 'opacity-30 grayscale'}`}
        >
          <Star
            className={`w-10 h-10 ${lit >= n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
          />
        </div>
      ))}
    </div>
  );
};

/* ─── Auto-next countdown bar ────────────────────────── */
const AutoNextBar = ({ seconds, onComplete, onCancel }) => {
  const [remaining, setRemaining] = useState(seconds);
  const cancelled = useRef(false);

  useEffect(() => {
    if (remaining <= 0) { if (!cancelled.current) onComplete(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const handleCancel = () => {
    cancelled.current = true;
    onCancel();
  };

  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
        <span>Next lesson in <strong>{remaining}s</strong>…</span>
        <button onClick={handleCancel} className="text-xs underline hover:text-gray-700 dark:hover:text-gray-200">
          Cancel
        </button>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-none rounded-full"
          style={{ width: `${pct}%`, transition: 'width 1s linear' }}
        />
      </div>
    </div>
  );
};

/* ══════════════ Main component ══════════════════════════ */
const LessonCompleteScreen = ({
  stats,            // { wpm, accuracy, timeElapsed, mistakes, wpmTarget }
  lessonTitle,
  lessonIndex,      // 0-based index in category
  totalLessons,
  hasNextLesson,
  onRetry,
  onNextLesson,
  onMenu,
  autoNextDelay = 5,
}) => {
  const [autoNext, setAutoNext] = useState(hasNextLesson);
  const [entered, setEntered] = useState(false);

  const xp = calcXP(stats.wpm, stats.accuracy, stats.mistakes);
  const stars = getStars(stats.wpm, stats.accuracy, stats.wpmTarget);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // trigger enter animation
    requestAnimationFrame(() => setEntered(true));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Confetti */}
      <Confetti active={stars >= 2} />

      {/* CSS keyframe injection */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div
        className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transition-all duration-400 ${
          entered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{ animation: entered ? 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both' : 'none' }}
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 pt-8 pb-6 text-center">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Lesson Complete!</h1>
          <p className="text-indigo-200 text-sm font-medium truncate">{lessonTitle}</p>

          {/* Journey progress */}
          {totalLessons > 1 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-indigo-200 mb-1">
                <span>Lesson {lessonIndex + 1}</span>
                <span>{lessonIndex + 1} / {totalLessons}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full transition-all duration-700"
                  style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Stars */}
          <StarRow stars={stars} />

          {/* XP badge */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-2 rounded-full font-bold text-lg shadow-lg">
              <Zap className="w-5 h-5" />
              +<XPCounter target={xp} /> XP
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'WPM', value: stats.wpm, icon: Zap, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
              { label: 'Accuracy', value: `${stats.accuracy}%`, icon: Target, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
              { label: 'Time', value: formatTime(stats.timeElapsed), icon: Clock, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { label: 'Mistakes', value: stats.mistakes, icon: XIcon, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                <div className={`text-lg font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          {/* Achievement pill */}
          {stats.accuracy === 100 && (
            <div className="flex justify-center mb-4">
              <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                <Award className="w-4 h-4" /> Perfect Accuracy!
              </span>
            </div>
          )}
          {stats.wpm >= stats.wpmTarget && (
            <div className="flex justify-center mb-4">
              <span className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" /> Speed Target Hit!
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl py-3 font-semibold transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>

            {hasNextLesson ? (
              <button
                onClick={() => { setAutoNext(false); onNextLesson(); }}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold transition-all shadow-lg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onMenu}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold transition-all shadow-lg"
              >
                <Home className="w-4 h-4" /> All Done!
              </button>
            )}

            <button
              onClick={onMenu}
              className="px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-all"
              title="Back to menu"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Auto-next countdown */}
          {autoNext && hasNextLesson && (
            <AutoNextBar
              seconds={autoNextDelay}
              onComplete={onNextLesson}
              onCancel={() => setAutoNext(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCompleteScreen;
