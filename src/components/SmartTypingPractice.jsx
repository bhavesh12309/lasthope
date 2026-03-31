import React, { useState, useEffect, useRef, useCallback } from "react";
import { TrendingUp, Zap, Target, AlertCircle, BarChart3 } from "lucide-react";

const FONTS = {
  mono: "font-mono text-sm tracking-wide",
  mono_lg: "font-mono text-lg tracking-wider",
  mono_xl: "font-mono text-3xl tracking-wider",
  mono_2xl: "font-mono text-5xl tracking-wide",
  sans: "font-sans text-base",
  sans_lg: "font-sans text-lg font-medium",
  sans_xl: "font-sans text-3xl font-medium",
  sans_2xl: "font-sans text-5xl font-semibold",
  serif: "font-serif text-base italic",
  serif_lg: "font-serif text-lg italic font-semibold",
  courier: "font-mono text-sm leading-relaxed",
  courier_lg: "font-mono text-lg leading-relaxed",
  compact: "font-mono text-xs tracking-tight",
  spacious: "font-sans text-lg tracking-wide leading-loose",
  bold: "font-bold font-mono text-base tracking-wide",
  light: "font-light font-sans text-base tracking-wide",
};

const LESSONS = [
  "Practice makes perfect and typing makes you faster.",
  "The quick brown fox jumps over the lazy dog.",
  "Focus on accuracy before speed and your pace will follow.",
  "Smart typing is not about rushing, but rhythm and precision.",
  "Consistency is the key to mastery in typing and in life.",
  "Every keystroke is a step toward excellence.",
  "Rhythm and accuracy dance together in perfect typing.",
  "Your fingers are becoming instruments of speed and grace.",
  "Mastery comes not from perfection, but from dedication.",
  "Type with purpose, and watch your skills transform.",
  "The early bird catches the worm, but the second mouse gets the cheese.",
  "Innovation distinguishes between a leader and a follower.",
  "Life is what happens when you are busy making other plans.",
  "The only way to do great work is to love what you do.",
  "Opportunities don't happen. You create them through hard work.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It is during our darkest moments that we must focus to see the light.",
  "The only impossible journey is the one you never begin.",
];

const THEMES = {
  dark: { bg: "from-gray-900 via-gray-800 to-black", card: "bg-gray-800", accent: "from-purple-600 to-blue-600", text: "text-gray-100" },
  ocean: { bg: "from-blue-950 via-cyan-900 to-teal-900", card: "bg-blue-900 bg-opacity-40", accent: "from-cyan-500 to-blue-500", text: "text-cyan-50" },
  forest: { bg: "from-green-950 via-emerald-900 to-teal-950", card: "bg-green-900 bg-opacity-40", accent: "from-emerald-500 to-teal-500", text: "text-emerald-50" },
  sunset: { bg: "from-orange-950 via-pink-900 to-purple-950", card: "bg-orange-900 bg-opacity-30", accent: "from-orange-500 to-pink-500", text: "text-orange-50" },
  cyberpunk: { bg: "from-fuchsia-950 via-purple-950 to-cyan-950", card: "bg-fuchsia-900 bg-opacity-30", accent: "from-fuchsia-500 to-cyan-500", text: "text-fuchsia-100" },
  midnight: { bg: "from-indigo-950 via-slate-900 to-black", card: "bg-indigo-900 bg-opacity-40", accent: "from-indigo-500 to-purple-500", text: "text-indigo-100" },
  cherry: { bg: "from-red-950 via-rose-900 to-pink-950", card: "bg-red-900 bg-opacity-40", accent: "from-rose-500 to-pink-500", text: "text-rose-50" },
  matcha: { bg: "from-lime-950 via-green-900 to-emerald-950", card: "bg-lime-900 bg-opacity-40", accent: "from-lime-400 to-green-500", text: "text-lime-50" },
};

const SmartTypingPractice = () => {
  const [lesson, setLesson] = useState(LESSONS[0]);
  const [input, setInput] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const inputRef = useRef(null);

  const [mode, setMode] = useState("balanced");
  const [theme, setTheme] = useState("dark");
  const [font, setFont] = useState("mono");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [mistakeDrill, setMistakeDrill] = useState(null);
  const [sessionStats, setSessionStats] = useState([]);
  const [weakCharacters, setWeakCharacters] = useState({});

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    if (type === "correct") {
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.1);
    } else if (type === "mistake") {
      osc.frequency.value = 300;
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.1);
    }
  }, [soundEnabled]);

  const updateStats = useCallback((newMistakes) => {
    const newWeakChars = { ...weakCharacters };
    newMistakes.forEach(char => {
      newWeakChars[char] = (newWeakChars[char] || 0) + 1;
    });
    setWeakCharacters(newWeakChars);
  }, [weakCharacters]);

  useEffect(() => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
      setSessionActive(true);
    }
    if (!startTime) return;

    const elapsedMin = (Date.now() - startTime) / 60000;
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const newWpm = Math.round(words / elapsedMin) || 0;

    const correct = input.split("").filter((ch, i) => ch === lesson[i]).length;
    const newAccuracy = Math.round((correct / Math.max(input.length, 1)) * 100);

    setWpm(newWpm);
    setAccuracy(newAccuracy);

    const newMistakes = [];
    input.split("").forEach((ch, i) => {
      if (ch !== lesson[i] && lesson[i]) newMistakes.push(lesson[i]);
    });
    setMistakes(newMistakes);
    updateStats(newMistakes);
  }, [input, lesson, startTime, updateStats]);

  useEffect(() => {
    if (mode === "zen" || !sessionActive) {
      setFeedback("");
      return;
    }

    if (mistakes.length === 0 && input.length > 5) {
      setFeedback("Perfect! Keep the momentum 💪");
      playSound("correct");
    } else if (mode === "accuracy" && mistakes.length > 3) {
      setFeedback("Slow down—precision matters ⏳");
      playSound("mistake");
    } else if (accuracy > 98) {
      setFeedback("Flawless execution! 🌟");
    } else if (accuracy < 80) {
      setFeedback("Focus on accuracy 🧠");
      playSound("mistake");
    } else {
      setFeedback("You're finding your rhythm 🚀");
    }
  }, [accuracy, mistakes, mode, input, sessionActive, playSound]);

  const finishSession = () => {
    if (wpm > 0 || accuracy < 100) {
      setSessionStats([...sessionStats, { wpm, accuracy, timestamp: Date.now(), lessonLength: lesson.length }]);
    }
    reset();
  };

  const nextLesson = () => {
    finishSession();
    setLesson(LESSONS[Math.floor(Math.random() * LESSONS.length)]);
    inputRef.current?.focus();
  };

  const startMistakeDrill = () => {
    if (mistakes.length === 0) return;
    const uniqueMistakes = [...new Set(mistakes)];
    setMistakeDrill(uniqueMistakes.join(" "));
    setLesson(uniqueMistakes.join(" "));
    setInput("");
    setStartTime(null);
    setMistakes([]);
    inputRef.current?.focus();
  };

  const reset = () => {
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setMistakes([]);
    setFeedback("");
    setSessionActive(false);
    inputRef.current?.focus();
  };

  const renderHighlightedText = () => {
    return lesson.split("").map((ch, i) => {
      const typedChar = input[i];
      let color = "text-gray-400";
      if (typedChar === ch) color = "text-green-400";
      else if (typedChar) color = "text-red-500";
      return (
        <span key={i} className={color}>
          {ch}
        </span>
      );
    });
  };

  const bestWpm = sessionStats.length > 0 ? Math.max(...sessionStats.map(s => s.wpm)) : 0;
  const avgAccuracy = sessionStats.length > 0 ? Math.round(sessionStats.reduce((sum, s) => sum + s.accuracy, 0) / sessionStats.length) : 100;
  const topWeakChars = Object.entries(weakCharacters).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const themeClasses = THEMES[theme];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${themeClasses.bg} ${themeClasses.text} p-4 md:p-8 transition-all duration-500`}>
      {/* Header */}
      <div className="w-full max-w-5xl mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${themeClasses.accent} bg-clip-text text-transparent mb-2`}>
              ⌨️ TypeFlow
            </h1>
            <p className="text-sm opacity-70">AI-Enhanced Typing Mastery</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-4 py-3 rounded-lg ${themeClasses.card} hover:scale-105 transition-transform text-lg`}
              title="Session Stats"
            >
              📊
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-4 py-3 rounded-lg ${themeClasses.card} hover:scale-105 transition-transform text-lg`}
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`${themeClasses.card} backdrop-blur-md p-6 rounded-2xl border border-white border-opacity-10 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
            <div>
              <label className="block text-xs font-semibold mb-2 opacity-80">MODE</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2 rounded-lg bg-black bg-opacity-30 text-inherit border border-white border-opacity-20 focus:border-opacity-50 transition"
              >
                <option value="accuracy">🎯 Accuracy</option>
                <option value="speed">⚡ Speed</option>
                <option value="zen">🧘 Zen</option>
                <option value="balanced">⚖️ Balanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 opacity-80">THEME</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2 rounded-lg bg-black bg-opacity-30 text-inherit border border-white border-opacity-20 focus:border-opacity-50 transition"
              >
                <option value="dark">🌙 Dark</option>
                <option value="ocean">🌊 Ocean</option>
                <option value="forest">🌲 Forest</option>
                <option value="sunset">🌅 Sunset</option>
                <option value="cyberpunk">🎮 Cyberpunk</option>
                <option value="midnight">⭐ Midnight</option>
                <option value="cherry">🍒 Cherry</option>
                <option value="matcha">🍵 Matcha</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 opacity-80">FONT SIZE</label>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full p-2 rounded-lg bg-black bg-opacity-30 text-inherit border border-white border-opacity-20 focus:border-opacity-50 transition"
              >
                <option value="compact">Compact (Extra Small)</option>
                <option value="mono">Mono (Small)</option>
                <option value="sans">Sans (Normal)</option>
                <option value="mono_lg">Mono (Large)</option>
                <option value="sans_lg">Sans (Large)</option>
                <option value="mono_xl">Mono (Extra Large)</option>
                <option value="sans_xl">Sans (Extra Large)</option>
                <option value="mono_2xl">Mono (2X Large)</option>
                <option value="sans_2xl">Sans (2X Large)</option>
                <option value="serif">Serif (Italic)</option>
                <option value="serif_lg">Serif (Large)</option>
                <option value="courier">Courier (Compact)</option>
                <option value="courier_lg">Courier (Spacious)</option>
                <option value="spacious">Spacious Flow</option>
                <option value="bold">Bold Mono</option>
                <option value="light">Light Sans</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white hover:bg-opacity-5 transition">
                <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm font-semibold">🔊 Sound Effects</span>
              </label>
            </div>
          </div>
        )}

        {/* Stats Panel */}
        {showStats && (
          <div className={`${themeClasses.card} backdrop-blur-md p-6 rounded-2xl border border-white border-opacity-10 mb-6`}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} />
              <h3 className="text-lg font-semibold">Session Analytics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                <p className="text-xs opacity-70 mb-1">Sessions</p>
                <p className="text-3xl font-bold">{sessionStats.length}</p>
              </div>
              <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                <p className="text-xs opacity-70 mb-1">Best WPM</p>
                <p className="text-3xl font-bold text-green-400">{bestWpm}</p>
              </div>
              <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                <p className="text-xs opacity-70 mb-1">Avg Accuracy</p>
                <p className="text-3xl font-bold text-blue-400">{avgAccuracy}%</p>
              </div>
              <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                <p className="text-xs opacity-70 mb-1">Weak Chars</p>
                <p className="text-3xl font-bold text-yellow-400">{topWeakChars.length}</p>
              </div>
            </div>
            {topWeakChars.length > 0 && (
              <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-3">Top Problem Characters:</p>
                <div className="flex gap-2 flex-wrap">
                  {topWeakChars.map(([char, count]) => (
                    <div key={char} className="bg-red-900 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                      <span className="font-mono font-bold">{char}</span>
                      <span className="ml-2 opacity-70">×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl">
        {/* Lesson Display */}
        <div className={`${themeClasses.card} backdrop-blur-md p-8 rounded-2xl border border-white border-opacity-10 mb-6 min-h-40 flex items-center justify-center transition-all duration-300 ${sessionActive ? "border-opacity-50 shadow-lg shadow-purple-500/20" : ""}`}>
          <div className={`${FONTS[font]} text-center leading-relaxed line-clamp-4 overflow-y-auto max-h-64`}>
            {renderHighlightedText()}
          </div>
        </div>

        {/* Input */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={() => !sessionActive && setSessionActive(false)}
          placeholder={mode === "zen" ? "Type freely..." : "Start typing..."}
          className={`w-full p-6 rounded-2xl bg-black bg-opacity-40 border-2 ${sessionActive ? "border-purple-500 border-opacity-70" : "border-white border-opacity-20"} focus:border-opacity-50 text-inherit focus:outline-none shadow-xl transition mb-6 resize-none ${FONTS[font]}`}
          rows="5"
          autoFocus
        />

        {/* Stats Grid */}
        {mode !== "zen" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: "⚡", label: "WPM", value: wpm, color: "from-green-500 to-emerald-600" },
              { icon: "🎯", label: "Accuracy", value: `${accuracy}%`, color: "from-blue-500 to-cyan-600" },
              { icon: "🔥", label: "Best", value: bestWpm, color: "from-yellow-500 to-orange-600" },
              { icon: "📊", label: "Sessions", value: sessionStats.length, color: "from-purple-500 to-pink-600" }
            ].map((stat, i) => (
              <div key={i} className={`${themeClasses.card} backdrop-blur-md p-4 rounded-xl border border-white border-opacity-10 hover:border-opacity-30 transition`}>
                <p className="text-xs font-semibold opacity-70 mb-1">{stat.icon} {stat.label}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`${themeClasses.card} backdrop-blur-md p-4 rounded-xl border border-white border-opacity-10 mb-6 text-lg font-semibold text-center animate-pulse`}>
            {feedback}
          </div>
        )}

        {/* Mistake Drill */}
        {mistakes.length > 0 && mode !== "zen" && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 backdrop-blur-md p-4 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-semibold mb-3">Problem characters: {[...new Set(mistakes)].join(", ")}</p>
                <button
                  onClick={startMistakeDrill}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  🎯 Practice Mistakes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            🔄 Reset
          </button>
          <button
            onClick={nextLesson}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
          >
            ➡️ Next Lesson
          </button>
          {mistakeDrill && (
            <button
              onClick={() => {
                setMistakeDrill(null);
                setLesson(LESSONS[Math.floor(Math.random() * LESSONS.length)]);
                reset();
              }}
              className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
            >
              ✕ Exit Drill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartTypingPractice;