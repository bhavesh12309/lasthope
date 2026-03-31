import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Volume2, TrendingUp, BarChart3, Award, Settings, Download, Trash2, Zap, Clock, Target } from 'lucide-react';

function WordCountMode() {
  const [wordCount, setWordCount] = useState(10);
  const [customCount, setCustomCount] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [testText, setTestText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [testActive, setTestActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [keySound, setKeySound] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [testHistory, setTestHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [personalBest, setPersonalBest] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakeMap, setMistakeMap] = useState({});
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const easyWords = [
    'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'pack', 'my',
    'head', 'code', 'typing', 'speed', 'test', 'words', 'minutes', 'errors', 'accuracy', 'computer'
  ];

  const mediumWords = [
    'beautiful', 'wonderful', 'programming', 'algorithm', 'architecture', 'experience',
    'infrastructure', 'development', 'methodology', 'optimization', 'performance', 'documentation',
    'validation', 'verification', 'implementation', 'integration', 'configuration', 'customization'
  ];

  const hardWords = [
    'extemporaneous', 'serendipitous', 'juxtaposition', 'ineffable', 'perspicacious',
    'obfuscation', 'ephemeral', 'mellifluous', 'sesquipedalian', 'defenestration',
    'phantasmagorical', 'petrichor', 'schadenfreude', 'borgesian', 'onomatopoeia'
  ];

  const fontSizes = {
    small: { text: 'text-sm', title: 'text-3xl', display: 'text-2xl' },
    normal: { text: 'text-base', title: 'text-4xl', display: 'text-3xl' },
    large: { text: 'text-lg', title: 'text-5xl', display: 'text-4xl' },
    xlarge: { text: 'text-xl', title: 'text-6xl', display: 'text-5xl' }
  };

  const getWordList = () => {
    switch(difficulty) {
      case 'medium': return mediumWords;
      case 'hard': return hardWords;
      default: return easyWords;
    }
  };

  const playSound = (type) => {
    if (!soundEnabled && type !== 'keystroke') return;
    if (!keySound && type === 'keystroke') return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'keystroke') {
      oscillator.frequency.value = 1400 + Math.random() * 200;
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
    } else if (type === 'correct') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'error') {
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === 'complete') {
      oscillator.frequency.value = 1200;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const generateTestText = (count) => {
    const words = getWordList();
    let selectedWords = [];
    for (let i = 0; i < count; i++) {
      selectedWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    return selectedWords.join(' ');
  };

  const startTest = () => {
    const actualCount = isCustomMode ? parseInt(customCount) || wordCount : wordCount;
    setTestText(generateTestText(actualCount));
    setUserInput('');
    setTimeElapsed(0);
    setTestActive(true);
    setTestComplete(false);
    setMistakeMap({});
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!testActive || testComplete) return;
    timerRef.current = setInterval(() => {
      setTimeElapsed(t => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [testActive, testComplete]);

  useEffect(() => {
    if (userInput.split(/\s+/).filter(w => w).length >= testText.split(/\s+/).length && testActive && testText) {
      setTestActive(false);
      setTestComplete(true);
      playSound('complete');
    }
  }, [userInput, testText, testActive]);

  const calculateStats = () => {
    const typedWords = userInput.trim().split(/\s+/).filter(w => w);
    const testWords = testText.split(/\s+/);
    
    let correctWords = 0;
    let mistakes = 0;
    let charMistakes = {};

    for (let i = 0; i < typedWords.length; i++) {
      const typed = typedWords[i] || '';
      const expected = testWords[i] || '';

      if (typed === expected) {
        correctWords++;
      } else {
        mistakes++;
        charMistakes[expected] = (charMistakes[expected] || 0) + 1;
      }
    }

    const minutes = timeElapsed / 60 || 1;
    const wpm = Math.round((typedWords.length / minutes) * 100) / 100;
    const accuracy = typedWords.length > 0 ? Math.round(((correctWords) / typedWords.length) * 100) : 0;
    const netWpm = Math.max(0, Math.round((wpm - (mistakes / minutes)) * 100) / 100);

    return { 
      wpm, 
      netWpm, 
      accuracy, 
      mistakes, 
      typedWords: typedWords.length, 
      totalWords: testWords.length, 
      time: timeElapsed,
      charMistakes,
      correctWords
    };
  };

  const saveTestResult = () => {
    const stats = calculateStats();
    setTestHistory([stats, ...testHistory]);
    setWpmHistory([stats.wpm, ...wpmHistory]);
    
    if (stats.wpm > personalBest) {
      setPersonalBest(stats.wpm);
    }
    
    if (stats.accuracy === 100) {
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    
    setMistakeMap(stats.charMistakes);
  };

  useEffect(() => {
    if (testComplete) {
      saveTestResult();
    }
  }, [testComplete]);

  const stats = testComplete ? calculateStats() : null;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  
  const avgWpm = wpmHistory.length > 0 ? Math.round(wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length * 100) / 100 : 0;
  const avgAccuracy = testHistory.length > 0 ? Math.round(testHistory.reduce((sum, t) => sum + t.accuracy, 0) / testHistory.length) : 0;

  const themeClasses = {
    dark: { bg: 'from-slate-950 via-slate-900 to-slate-950', card: 'bg-slate-800/80 backdrop-blur border border-slate-700/50', text: 'text-white', textAlt: 'text-slate-300', input: 'bg-slate-700/50 border border-slate-600', accent: 'from-cyan-500 to-blue-600' },
    light: { bg: 'from-blue-50 via-white to-indigo-50', card: 'bg-white/90 backdrop-blur border border-blue-200/50', text: 'text-slate-900', textAlt: 'text-slate-600', input: 'bg-slate-100 border border-slate-300', accent: 'from-cyan-500 to-blue-600' },
  };

  const t = themeClasses[theme];
  const fs = fontSizes[fontSize];

  const downloadStats = () => {
    const csv = [
      ['WPM', 'Net WPM', 'Accuracy', 'Mistakes', 'Words Typed', 'Time (s)'],
      ...testHistory.map(test => [test.wpm, test.netWpm, test.accuracy, test.mistakes, test.typedWords, test.time])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typing-stats-${new Date().toISOString()}.csv`;
    a.click();
  };

  const mostMistakenWords = Object.entries(mistakeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const currentWPM = testActive ? Math.round((userInput.trim().split(/\s+/).filter(w => w).length / Math.max(1, timeElapsed / 60)) * 100) / 100 : 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.bg} p-6 md:p-8 transition-all duration-500`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">⌨️</div>
                <h1 className={`${fs.title} font-black bg-gradient-to-r ${t.accent} bg-clip-text text-transparent`}>TypeMaster</h1>
              </div>
              <p className={`${t.textAlt} ${fs.text} font-medium`}>Master your typing speed and accuracy</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-3 rounded-xl ${t.card} hover:scale-110 transition-transform duration-200 shadow-md`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-xl transition-all duration-200 shadow-md ${soundEnabled ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-105' : `${t.card}`}`}
                title="Toggle sound effects"
              >
                <Volume2 size={20} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-xl ${t.card} hover:scale-110 transition-all duration-200 shadow-md`}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {showSettings && (
            <div className={`${t.card} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`${t.text} font-bold text-lg mb-6 flex items-center gap-2`}>⚙️ Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <p className={`${t.textAlt} text-xs font-bold uppercase tracking-wide mb-3`}>Font Size</p>
                  <div className="flex flex-col gap-2">
                    {['small', 'normal', 'large', 'xlarge'].map(size => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${fontSize === size ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md scale-105' : `${t.input} ${t.textAlt} hover:scale-105`}`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className={`${t.textAlt} text-xs font-bold uppercase tracking-wide mb-3`}>Sound Effects</p>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${soundEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' : `${t.input} ${t.textAlt} hover:scale-105`}`}
                  >
                    {soundEnabled ? '✓ Enabled' : 'Disabled'}
                  </button>
                </div>
                <div>
                  <p className={`${t.textAlt} text-xs font-bold uppercase tracking-wide mb-3`}>Key Sound</p>
                  <button
                    onClick={() => setKeySound(!keySound)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${keySound ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md' : `${t.input} ${t.textAlt} hover:scale-105`}`}
                  >
                    {keySound ? '✓ On' : 'Off'}
                  </button>
                </div>
                <div>
                  <p className={`${t.textAlt} text-xs font-bold uppercase tracking-wide mb-3`}>Focus Mode</p>
                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${focusMode ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md' : `${t.input} ${t.textAlt} hover:scale-105`}`}
                  >
                    {focusMode ? '✓ On' : 'Off'}
                  </button>
                </div>
                <div>
                  <p className={`${t.textAlt} text-xs font-bold uppercase tracking-wide mb-3`}>Clear Data</p>
                  <button
                    onClick={() => {
                      setTestHistory([]);
                      setWpmHistory([]);
                      setMistakeMap({});
                      setPersonalBest(0);
                      setStreak(0);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${t.input} ${t.textAlt} hover:scale-105 transition-all duration-200`}
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {!testActive && !testComplete && (
              <div className={`${t.card} rounded-2xl p-8 shadow-2xl`}>
                <div className="space-y-8">
                  <div>
                    <p className={`${t.textAlt} mb-4 font-bold text-lg uppercase tracking-wide`}>📋 Test Type</p>
                    <div className="flex gap-3">
                      {['time', 'word'].map(m => (
                        <button
                          key={m}
                          onClick={() => setWordCount(m === 'time' ? 60 : 25)}
                          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                            (m === 'time' && wordCount === 60) || (m === 'word' && wordCount === 25)
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                              : `${t.input} ${t.textAlt}`
                          }`}
                        >
                          {m === 'time' ? '⏱️ Timed' : '📝 Words'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={`${t.textAlt} mb-4 font-bold text-lg uppercase tracking-wide`}>⚡ Difficulty</p>
                    <div className="flex gap-3">
                      {[
                        { key: 'easy', label: 'Easy', emoji: '🟢' },
                        { key: 'medium', label: 'Medium', emoji: '🟡' },
                        { key: 'hard', label: 'Hard', emoji: '🔴' }
                      ].map(d => (
                        <button
                          key={d.key}
                          onClick={() => setDifficulty(d.key)}
                          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                            difficulty === d.key
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                              : `${t.input} ${t.textAlt}`
                          }`}
                        >
                          {d.emoji} {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={`${t.textAlt} mb-4 font-bold text-lg uppercase tracking-wide`}>🔢 Word Count</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {[10, 25, 50, 100, 200, 300].map(count => (
                        <button
                          key={count}
                          onClick={() => {
                            setWordCount(count);
                            setIsCustomMode(false);
                          }}
                          className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
                            !isCustomMode && wordCount === count
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                              : `${t.input} ${t.textAlt}`
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                    
                    <input
                      type="number"
                      value={customCount}
                      onChange={(e) => {
                        setCustomCount(e.target.value);
                        setIsCustomMode(true);
                      }}
                      placeholder="Or enter custom number..."
                      className={`w-full px-4 py-3 rounded-xl ${t.input} ${t.text} placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 border-2 transition-all duration-200 font-semibold`}
                    />
                  </div>

                  <button
                    onClick={startTest}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 text-lg shadow-xl active:scale-95 duration-200"
                  >
                    🚀 Start Typing Test
                  </button>
                </div>
              </div>
            )}

            {(testActive || testComplete) && (
              <div className={`${t.card} rounded-2xl p-8 space-y-6 shadow-2xl`}>
                <div className="grid grid-cols-3 gap-4">
                  <div className={`${t.input} rounded-xl p-4 text-center border-2 border-transparent hover:border-cyan-500 transition-all`}>
                    <p className={`${t.textAlt} text-xs font-bold uppercase tracking-wide mb-2`}><Clock size={14} className="inline mr-1" /> Time</p>
                    <p className={`${fs.display} font-black text-cyan-400 font-mono`}>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</p>
                  </div>
                  
                  {testActive && (
                    <div className={`${t.input} rounded-xl p-4 text-center border-2 border-transparent hover:border-purple-500 transition-all`}>
                      <p className={`${t.textAlt} text-xs font-bold uppercase tracking-wide mb-2`}><Zap size={14} className="inline mr-1" /> Speed</p>
                      <p className={`${fs.display} font-black text-purple-400 font-mono`}>{currentWPM}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setTestActive(false);
                      setTestComplete(false);
                      setUserInput('');
                    }}
                    className={`${t.input} rounded-xl p-4 flex items-center justify-center gap-2 font-bold hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-red-500`}
                  >
                    <RotateCcw size={18} /> Reset
                  </button>
                </div>

                {focusMode ? (
                  <div className={`${t.input} p-6 rounded-2xl border-2 border-cyan-500/30`}>
                    <p className={`${t.textAlt} ${fs.display} font-mono font-bold text-center leading-relaxed`}>
                      {testText.split(' ').map((word, i) => {
                        const typedWords = userInput.trim().split(/\s+/).filter(w => w);
                        const isCorrect = typedWords[i] === word;
                        const isCurrent = typedWords.length === i;
                        let color = t.textAlt;
                        if (isCurrent) color = 'text-cyan-400 animate-pulse';
                        if (i < typedWords.length) color = isCorrect ? 'text-green-400' : 'text-red-500';
                        return <span key={i} className={color}>{word} </span>;
                      })}
                    </p>
                  </div>
                ) : (
                  <div className={`${t.input} p-6 rounded-2xl min-h-32 max-h-48 overflow-y-auto border-2 border-cyan-500/30 backdrop-blur`}>
                    <p className={`${t.textAlt} ${fs.text} leading-relaxed font-mono`}>
                      {testText.split('').map((char, i) => {
                        const userChar = userInput[i];
                        let color = t.textAlt;
                        
                        if (userChar === undefined) {
                          color = i === userInput.length ? 'text-cyan-400 bg-cyan-500/20 animate-pulse font-bold' : t.textAlt;
                        } else if (userChar === char) {
                          color = 'text-green-400';
                        } else {
                          color = 'text-red-500 bg-red-500/20';
                        }
                        
                        return (
                          <span key={i} className={color}>
                            {char}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setUserInput(newValue);
                    
                    if (keySound && testActive) {
                      playSound('keystroke');
                    }
                    
                    if (soundEnabled) {
                      const lastChar = newValue[newValue.length - 1];
                      if (newValue.length > 0 && testText[newValue.length - 1] === lastChar) {
                        playSound('correct');
                      } else if (newValue.length > 0) {
                        playSound('error');
                      }
                    }
                  }}
                  disabled={testComplete}
                  placeholder={testActive ? "Start typing..." : "Test complete"}
                  className={`w-full px-4 py-4 ${t.input} ${t.text} rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 font-mono ${fs.text} border-2 focus:border-cyan-500 transition-all duration-200 font-bold`}
                  autoFocus
                />

                {testComplete && stats && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-center text-white shadow-lg transform hover:scale-105 transition-transform">
                      <p className="text-xs font-bold uppercase tracking-wide opacity-90">WPM</p>
                      <p className="text-2xl font-black mt-2 font-mono">{stats.wpm}</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4 text-center text-white shadow-lg transform hover:scale-105 transition-transform">
                      <p className="text-xs font-bold uppercase tracking-wide opacity-90">Net WPM</p>
                      <p className="text-2xl font-black mt-2 font-mono">{stats.netWpm}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-center text-white shadow-lg transform hover:scale-105 transition-transform">
                      <p className="text-xs font-bold uppercase tracking-wide opacity-90">Accuracy</p>
                      <p className="text-2xl font-black mt-2 font-mono">{stats.accuracy}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 text-center text-white shadow-lg transform hover:scale-105 transition-transform">
                      <p className="text-xs font-bold uppercase tracking-wide opacity-90">Mistakes</p>
                      <p className="text-2xl font-black mt-2 font-mono">{stats.mistakes}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl p-4 text-center text-white shadow-lg transform hover:scale-105 transition-transform">
                      <p className="text-xs font-bold uppercase tracking-wide opacity-90">Time</p>
                      <p className="text-2xl font-black mt-2 font-mono">{stats.time}s</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={`${t.card} rounded-2xl p-6 shadow-xl`}>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-cyan-400" size={20} />
                <h3 className={`${t.text} font-bold`}>Quick Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
                  <p className="text-xs font-bold uppercase opacity-90">Personal Best</p>
                  <p className="text-3xl font-black mt-2">{personalBest}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg">
                  <p className="text-xs font-bold uppercase opacity-90">Avg WPM</p>
                  <p className="text-3xl font-black mt-2">{avgWpm}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
                  <p className="text-xs font-bold uppercase opacity-90">Perfect Streak</p>
                  <p className="text-3xl font-black mt-2">🔥 {streak}</p>
                </div>
              </div>
            </div>

            {testHistory.length > 0 && (
              <div className={`${t.card} rounded-2xl p-6 shadow-xl`}>
                <div className="flex items-center gap-2 mb-6">
                  <Award className="text-yellow-400" size={20} />
                  <h3 className={`${t.text} font-bold`}>Achievements</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {personalBest >= 100 && (
                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
                      <p className="text-yellow-300 font-bold">🏆 Speedster: {personalBest} WPM</p>
                    </div>
                  )}
                  {personalBest >= 60 && personalBest < 100 && (
                    <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3">
                      <p className="text-orange-300 font-bold">🔥 Speed Demon: {personalBest} WPM</p>
                    </div>
                  )}
                  {avgAccuracy >= 99 && (
                    <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
                      <p className="text-blue-300 font-bold">✨ Accuracy Master</p>
                    </div>
                  )}
                  {streak >= 3 && (
                    <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-3">
                      <p className="text-purple-300 font-bold">⚡ On Fire: {streak} perfect</p>
                    </div>
                  )}
                  {testHistory.length >= 10 && (
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-3">
                      <p className="text-green-300 font-bold">💪 Grind: 10+ tests</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {mostMistakenWords.length > 0 && (
              <div className={`${t.card} rounded-2xl p-6 shadow-xl`}>
                <div className="flex items-center gap-2 mb-6">
                  <Target className="text-red-400" size={20} />
                  <h3 className={`${t.text} font-bold`}>Problem Words</h3>
                </div>
                <div className="space-y-2">
                  {mostMistakenWords.map(([word, count]) => (
                    <div key={word} className={`${t.input} p-3 rounded-lg flex justify-between items-center border-l-4 border-red-500`}>
                      <span className="font-mono font-bold text-sm">{word}</span>
                      <span className="text-red-400 font-bold bg-red-500/20 px-3 py-1 rounded-full">{count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testHistory.length > 0 && (
              <div className={`${t.card} rounded-2xl p-6 shadow-xl`}>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="text-indigo-400" size={20} />
                  <h3 className={`${t.text} font-bold`}>Recent Tests</h3>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {testHistory.slice(0, 8).map((test, i) => (
                    <div key={i} className={`${t.input} p-3 rounded-lg hover:scale-105 transition-transform border-l-4 border-green-500`}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <span className="font-mono font-bold text-green-400 text-sm">{test.wpm}</span>
                          <span className={`${t.textAlt} text-xs font-bold`}>WPM</span>
                        </div>
                        <span className="text-blue-400 font-bold text-sm">{test.accuracy}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={downloadStats}
                  className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-200 shadow-md`}
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordCountMode;