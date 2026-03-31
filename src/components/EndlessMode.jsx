import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Play, Pause, Shuffle, Zap, Trophy, Volume2, VolumeX } from 'lucide-react';

const WORD_SETS = {
  common: ['the','quick','brown','fox','jumps','over','lazy','dog','react','javascript','keyboard','practice','speed','accuracy','focus','coding','design','layout','component','state','effect','hook','challenge','improve','master','type','learn','repeat','adaptive','random','generate','persist','score','streak','session','timer','challenge','endless','flow','rhythm'],
  tech: ['algorithm','boolean','cache','database','debug','deploy','function','github','interface','javascript','library','module','node','object','package','query','react','schema','server','syntax','typescript','variable','webpack','async','callback'],
  long: ['documentation','infrastructure','implementation','accessibility','configuration','performance','synchronization','optimization','authentication','authorization','visualization','productivity','persistence','dependency','reliability','compatibility'],
};

const FONT_SIZES = {
  sm: { label: 'Small', class: 'text-base' },
  md: { label: 'Medium', class: 'text-xl' },
  lg: { label: 'Large', class: 'text-2xl' },
  xl: { label: 'Extra Large', class: 'text-4xl' },
};

function Endlessmode() {
  // Config
  const [wordSet, setWordSet] = useState('common');
  const [difficulty, setDifficulty] = useState('normal');
  const [fontSize, setFontSize] = useState('lg');
  const [showStats, setShowStats] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Core state
  const [words, setWords] = useState(() => generateBatch(WORD_SETS.common, 60));
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [bestWpm, setBestWpm] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(100);
  const [bestStreak, setBestStreak] = useState(0);

  const inputRef = useRef(null);
  const tickerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize audio context on first user interaction
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.error('Audio context error:', e);
      }
    }
  };

  // Play typing sound
  const playTypeSound = useCallback((isCorrect = true) => {
    if (!soundEnabled) return;
    
    initAudioContext();
    if (!audioContextRef.current) return;

    try {
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else {
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      console.error('Sound playback error:', e);
    }
  }, [soundEnabled]);

  // Timer
  useEffect(() => {
    if (!running) return;
    if (!startTime) setStartTime(Date.now() - elapsedMs);
    tickerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - (startTime || Date.now()));
    }, 100);
    return () => clearInterval(tickerRef.current);
  }, [running, startTime]);

  // Focus input
  useEffect(() => {
    if (running && inputRef.current) inputRef.current.focus();
  }, [running]);

  // Auto-replenish words
  useEffect(() => {
    if (words.length - wordIndex < 20) {
      const source = WORD_SETS[wordSet] || WORD_SETS.common;
      setWords(prev => [...prev, ...generateBatch(source, 50)]);
    }
  }, [wordIndex, words.length, wordSet]);

  // Stats computation
  const minutes = Math.max(1 / 60, elapsedMs / 60000);
  const wpm = Math.round((correctChars / 5) / minutes);
  const accuracy = totalTypedChars === 0 ? 100 : Math.round((correctChars / totalTypedChars) * 10000) / 100;

  // Update bests
  useEffect(() => {
    if (running && wpm > bestWpm) setBestWpm(wpm);
    if (running && accuracy < bestAccuracy && totalTypedChars > 50) setBestAccuracy(accuracy);
    if (streak > bestStreak) setBestStreak(streak);
  }, [wpm, accuracy, streak]);

  // Key handler with visual feedback
  const handleKey = useCallback((e) => {
    if (!running && e.key !== ' ') {
      initAudioContext();
      setRunning(true);
    }
    
    const key = e.key;
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();

    if (key === 'Backspace') {
      setTotalTypedChars(prev => Math.max(0, prev - 1));
      if (charIndex > 0) setCharIndex(ci => ci - 1);
      setInputValue(val => val.slice(0, -1));
      playTypeSound(false);
      return;
    }

    if (key.length === 1 || key === ' ') {
      const currentWord = words[wordIndex] || '';
      const expectedChar = charIndex < currentWord.length ? currentWord[charIndex] : ' ';
      const typedChar = key === ' ' ? ' ' : key;

      setTotalTypedChars(prev => prev + 1);

      if (typedChar === expectedChar) {
        setCorrectChars(prev => prev + 1);
        setCharIndex(ci => ci + 1);
        setInputValue(iv => iv + typedChar);
        playTypeSound(true);

        if (typedChar === ' ' || (typedChar === ' ' && charIndex >= currentWord.length)) {
          setWordIndex(wi => wi + 1);
          setCharIndex(0);
          setInputValue('');
          setStreak(s => s + 1);
        }
      } else {
        setMistakes(m => m + 1);
        setStreak(0);
        setInputValue(iv => iv + typedChar);
        setCharIndex(ci => ci + 1);
        playTypeSound(false);
      }
    }
  }, [running, words, wordIndex, charIndex, playTypeSound]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const resetSession = () => {
    const source = WORD_SETS[wordSet] || WORD_SETS.common;
    if (totalTypedChars > 10) {
      setSessionHistory([...sessionHistory, { wpm, accuracy, streak, mistakes, duration: elapsedMs }]);
    }
    setWords(generateBatch(source, 60));
    setWordIndex(0);
    setCharIndex(0);
    setInputValue('');
    setRunning(false);
    setStartTime(null);
    setElapsedMs(0);
    setCorrectChars(0);
    setTotalTypedChars(0);
    setMistakes(0);
    setStreak(0);
  };

  const toggleRunning = () => {
    setRunning(!running);
    if (!running && !startTime) setStartTime(Date.now());
  };

  const changeWordSet = (set) => {
    setWordSet(set);
    const source = WORD_SETS[set] || WORD_SETS.common;
    setWords(generateBatch(source, 60));
    setWordIndex(0);
    setCharIndex(0);
    setRunning(false);
  };

  const shuffleWords = () => {
    setWords(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  const avgWpm = sessionHistory.length > 0 
    ? Math.round(sessionHistory.reduce((sum, s) => sum + s.wpm, 0) / sessionHistory.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-amber-400" />
            TypeFlow
          </h1>
          <p className="text-slate-400">Master your typing speed and accuracy</p>
        </div>

        {/* Main card */}
        <div className="bg-slate-700 rounded-2xl shadow-2xl p-8 mb-6 border border-slate-600">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={toggleRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  running
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetSession}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={shuffleWords}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition"
                title="Toggle sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition"
              >
                <Trophy className="w-4 h-4" />
                Stats
              </button>
            </div>
          </div>

          {/* Word Set, Difficulty & Font Size */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Word Set</label>
              <div className="flex gap-2">
                {Object.keys(WORD_SETS).map(set => (
                  <button
                    key={set}
                    onClick={() => changeWordSet(set)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition capitalize ${
                      wordSet === set
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                    }`}
                  >
                    {set}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['easy', 'normal', 'hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition capitalize ${
                      difficulty === diff
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
              <div className="flex gap-1 bg-slate-600 rounded-lg p-1">
                {Object.entries(FONT_SIZES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setFontSize(key)}
                    className={`flex-1 px-2 py-1.5 rounded text-xs font-semibold transition duration-200 ${
                      fontSize === key
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    title={`${val.label} font size`}
                  >
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Word display */}
          <div className={`p-6 rounded-xl bg-slate-800 border border-slate-600 mb-6 min-h-[120px] font-mono ${FONT_SIZES[fontSize].class} leading-relaxed`}>
            {renderWordLine(words, wordIndex, charIndex, fontSize)}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
              <div className="text-slate-400 text-sm font-medium">WPM</div>
              <div className="text-3xl font-bold text-emerald-400 mt-1">{wpm}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
              <div className="text-slate-400 text-sm font-medium">Accuracy</div>
              <div className={`text-3xl font-bold mt-1 ${accuracy >= 95 ? 'text-emerald-400' : accuracy >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                {accuracy}%
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
              <div className="text-slate-400 text-sm font-medium">Time</div>
              <div className="text-3xl font-bold text-blue-400 mt-1">{formatMs(elapsedMs)}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
              <div className="text-slate-400 text-sm font-medium">Streak</div>
              <div className="text-3xl font-bold text-amber-400 mt-1">{streak}</div>
            </div>
          </div>

          {/* Secondary stats */}
          <div className="flex justify-between text-sm text-slate-400 px-2">
            <div>Typed: <span className="text-white font-semibold">{totalTypedChars}</span></div>
            <div>Mistakes: <span className="text-red-400 font-semibold">{mistakes}</span></div>
          </div>
        </div>

        {/* Stats modal */}
        {showStats && (
          <div className="bg-slate-700 rounded-2xl shadow-2xl p-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6">Session Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                <div className="text-slate-400 text-sm">Best WPM</div>
                <div className="text-2xl font-bold text-emerald-400 mt-2">{bestWpm}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                <div className="text-slate-400 text-sm">Best Accuracy</div>
                <div className="text-2xl font-bold text-blue-400 mt-2">{bestAccuracy}%</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                <div className="text-slate-400 text-sm">Best Streak</div>
                <div className="text-2xl font-bold text-amber-400 mt-2">{bestStreak}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                <div className="text-slate-400 text-sm">Average WPM</div>
                <div className="text-2xl font-bold text-purple-400 mt-2">{avgWpm}</div>
              </div>
            </div>

            {sessionHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Recent Sessions</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[...sessionHistory].reverse().slice(0, 10).map((session, i) => (
                    <div key={i} className="flex justify-between text-sm text-slate-300 bg-slate-800 p-3 rounded-lg">
                      <span>{session.wpm} WPM</span>
                      <span>{session.accuracy}% • {session.streak} streak</span>
                      <span className="text-slate-500">{formatMs(session.duration)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={() => {}}
          className="opacity-0 h-0 pointer-events-none"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// Helpers
function generateBatch(source, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(source[Math.floor(Math.random() * source.length)]);
  }
  return out;
}

function renderWordLine(words, wi, ci, fontSize) {
  const start = Math.max(0, wi - 4);
  const end = Math.min(words.length, wi + 14);
  const slice = words.slice(start, end);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {slice.map((w, i) => {
        const absIndex = start + i;
        const isActive = absIndex === wi;

        if (!isActive) {
          return (
            <div
              key={absIndex}
              className="px-2 py-1 rounded text-slate-500 opacity-60 hover:opacity-80 transition"
            >
              {w}
            </div>
          );
        }

        return (
          <div
            key={absIndex}
            className="px-3 py-1 rounded bg-slate-900 border-2 border-blue-500 shadow-lg"
          >
            {renderChars(w, ci)}
          </div>
        );
      })}
    </div>
  );
}

function renderChars(word, charIndex) {
  const chars = (word + ' ').split('');
  return (
    <span className="inline-flex items-center">
      {chars.map((ch, i) => (
        <span
          key={i}
          className={`px-1 transition ${
            i < charIndex
              ? 'opacity-50 text-emerald-400'
              : i === charIndex
              ? 'text-white animate-pulse bg-blue-500 rounded'
              : 'text-slate-300'
          }`}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

function formatMs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default Endlessmode;