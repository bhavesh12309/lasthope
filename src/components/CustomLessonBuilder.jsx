import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Save, FileText, Download, Copy, Trash2, Edit, Volume2, VolumeX, X, Menu, Sparkles, Trophy, Target, Clock, Zap } from 'lucide-react';

// Utility Functions
const calculateWPM = (correctChars, timeInSeconds) => {
  if (timeInSeconds === 0) return 0;
  return Math.round((correctChars / 5) / (timeInSeconds / 60));
};

const calculateAccuracy = (correct, total) => {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Sound Generator
const createSound = (freq, type, duration = 0.05) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const soundPacks = {
  clicky: { correct: () => createSound(800, 'square', 0.03), error: () => createSound(200, 'sawtooth', 0.1) },
  soft: { correct: () => createSound(600, 'sine', 0.04), error: () => createSound(150, 'sine', 0.15) },
  typewriter: { correct: () => createSound(1200, 'square', 0.02), error: () => createSound(100, 'triangle', 0.2) },
  retro: { correct: () => createSound(440, 'square', 0.05), error: () => createSound(110, 'square', 0.15) }
};

// Template Lessons
const templateLessons = [
  {
    id: 'home-row',
    title: 'Home Row Basics',
    description: 'Practice fundamental finger placement',
    icon: '🎯',
    difficulty: 'Beginner',
    text: 'asdf jkl; asdf jkl; aaa sss ddd fff jjj kkk lll ;;; fast hands dash flask glass; half salad fad lash'
  },
  {
    id: 'advanced',
    title: 'Advanced Words',
    description: 'Complex vocabulary practice',
    icon: '🚀',
    difficulty: 'Advanced',
    text: 'The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow. Pack my box with five dozen liquor jugs.'
  },
  {
    id: 'coding',
    title: 'Coding Syntax',
    description: 'Programming symbols and structure',
    icon: '💻',
    difficulty: 'Expert',
    text: 'const myFunction = (param) => { return param * 2; }; if (condition) { console.log("true"); } else { return false; }'
  },
  {
    id: 'story',
    title: 'Story Mode',
    description: 'Engaging narrative text',
    icon: '📖',
    difficulty: 'Intermediate',
    text: 'In a distant galaxy, among countless stars, there lived a curious explorer named Aria. She traveled through cosmic storms and nebulae, discovering ancient civilizations and their forgotten wisdom.'
  }
];

const CustomTypingLesson = () => {
  // State Management
  const [mode, setMode] = useState('edit');
  const [customText, setCustomText] = useState('');
  const [currentLesson, setCurrentLesson] = useState(null);
  const [savedLessons, setSavedLessons] = useState([]);
  
  // Typing State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  
  // Customization State
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(20);
  const [lineSpacing, setLineSpacing] = useState(1.6);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundPack, setSoundPack] = useState('clicky');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Refs
  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  
  // Load saved lessons
  useEffect(() => {
    const saved = localStorage.getItem('typingLessons');
    if (saved) {
      setSavedLessons(JSON.parse(saved));
    }
  }, []);
  
  // Timer
  useEffect(() => {
    if (mode === 'practice' && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, startTime]);
  
  // Countdown
  useEffect(() => {
    if (mode === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setMode('practice');
        setStartTime(Date.now());
      }
    }
  }, [mode, countdown]);
  
  // Keyboard Handler
  const handleKeyPress = useCallback((e) => {
    if (mode !== 'practice' || !currentLesson) return;
    
    const char = e.key;
    const targetChar = currentLesson.text[currentIndex];
    
    if (char === targetChar) {
      setTypedChars([...typedChars, { char, correct: true }]);
      setCurrentIndex(currentIndex + 1);
      setCorrectChars(correctChars + 1);
      if (soundEnabled) soundPacks[soundPack].correct();
      
      if (currentIndex + 1 === currentLesson.text.length) {
        setMode('complete');
      }
    } else if (char.length === 1) {
      setTypedChars([...typedChars, { char: targetChar, correct: false }]);
      setMistakes(mistakes + 1);
      if (soundEnabled) soundPacks[soundPack].error();
    }
  }, [mode, currentIndex, currentLesson, typedChars, mistakes, correctChars, soundEnabled, soundPack]);
  
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [handleKeyPress]);
  
  // File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomText(event.target.result);
      };
      reader.readAsText(file);
    }
  };
  
  // Start Lesson
  const startLesson = (lesson) => {
    setCurrentLesson(lesson);
    setMode('countdown');
    setCountdown(3);
    resetTypingState();
  };
  
  const resetTypingState = () => {
    setCurrentIndex(0);
    setTypedChars([]);
    setMistakes(0);
    setCorrectChars(0);
    setStartTime(null);
    setElapsedTime(0);
  };
  
  // Save Lesson
  const saveLesson = () => {
    if (!customText.trim()) return;
    
    const lesson = {
      id: Date.now().toString(),
      title: `Custom Lesson ${savedLessons.length + 1}`,
      description: 'Custom typing practice',
      text: customText,
      icon: '⭐',
      fontFamily,
      fontSize,
      lineSpacing,
      soundPack,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...savedLessons, lesson];
    setSavedLessons(updated);
    localStorage.setItem('typingLessons', JSON.stringify(updated));
  };
  
  // Delete Lesson
  const deleteLesson = (id) => {
    const updated = savedLessons.filter(l => l.id !== id);
    setSavedLessons(updated);
    localStorage.setItem('typingLessons', JSON.stringify(updated));
  };
  
  // Export Results
  const exportAsCSV = () => {
    const wpm = calculateWPM(correctChars, elapsedTime);
    const accuracy = calculateAccuracy(correctChars, currentIndex);
    const csv = `Metric,Value\nWPM,${wpm}\nAccuracy,${accuracy}%\nTime,${formatTime(elapsedTime)}\nMistakes,${mistakes}\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typing-results.csv';
    a.click();
  };
  
  const copyResults = () => {
    const wpm = calculateWPM(correctChars, elapsedTime);
    const accuracy = calculateAccuracy(correctChars, currentIndex);
    const text = `Typing Results:\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nTime: ${formatTime(elapsedTime)}\nMistakes: ${mistakes}`;
    navigator.clipboard.writeText(text);
  };
  
  // Render Text
  const renderText = () => {
    if (!currentLesson) return null;
    
    return currentLesson.text.split('').map((char, idx) => {
      let className = 'transition-all duration-150 ';
      
      if (idx < currentIndex) {
        className += typedChars[idx]?.correct 
          ? 'text-emerald-500 dark:text-emerald-400' 
          : 'text-rose-500 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-0.5 rounded';
      } else if (idx === currentIndex) {
        className += 'bg-gradient-to-r from-blue-500 to-purple-500 text-white px-1 rounded shadow-lg scale-110 inline-block';
      } else {
        className += 'text-gray-500 dark:text-gray-400';
      }
      
      return (
        <span key={idx} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };
  
  const fontClasses = {
    'Inter': 'font-sans',
    'Mono': 'font-mono',
    'Retro Pixel': 'font-mono tracking-wider',
    'Handwriting': 'font-serif italic',
    'Serif': 'font-serif'
  };
  
  const wpm = calculateWPM(correctChars, elapsedTime);
  const accuracy = calculateAccuracy(correctChars, currentIndex || 1);
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      <div className="min-h-screen backdrop-blur-sm">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TypeMaster</h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Custom Typing Lessons</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all hover:scale-105"
                >
                  {soundEnabled ? 
                    <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : 
                    <VolumeX className="w-5 h-5 text-gray-500" />
                  }
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all hover:scale-105"
                >
                  <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2.5 rounded-lg transition-all hover:scale-105 ${showSettings ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <Settings className={`w-5 h-5 ${showSettings ? 'text-blue-600 dark:text-blue-400 rotate-90' : 'text-gray-700 dark:text-gray-300'} transition-transform`} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 space-y-4 transition-all`}>
              {/* Settings Panel */}
              {showSettings && (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      Settings
                    </h3>
                    <button onClick={() => setShowSettings(false)} className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Font Family</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Inter', 'Mono', 'Retro Pixel', 'Handwriting', 'Serif'].map(font => (
                          <button
                            key={font}
                            onClick={() => setFontFamily(font)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              fontFamily === font
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {font}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Font Size: <span className="text-blue-600 dark:text-blue-400">{fontSize}px</span>
                      </label>
                      <input
                        type="range"
                        min="14"
                        max="32"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Line Spacing: <span className="text-blue-600 dark:text-blue-400">{lineSpacing.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.1"
                        value={lineSpacing}
                        onChange={(e) => setLineSpacing(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                    
                    {soundEnabled && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sound Pack</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'clicky', name: 'Clicky', icon: '⌨️' },
                            { id: 'soft', name: 'Soft', icon: '🎹' },
                            { id: 'typewriter', name: 'Typewriter', icon: '📠' },
                            { id: 'retro', name: 'Retro', icon: '🕹️' }
                          ].map(pack => (
                            <button
                              key={pack.id}
                              onClick={() => setSoundPack(pack.id)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                soundPack === pack.id
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              {pack.icon} {pack.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Templates */}
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Templates
                </h3>
                <div className="space-y-3">
                  {templateLessons.map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => setCustomText(lesson.text)}
                      className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 hover:shadow-lg transition-all hover:scale-105 border border-gray-200 dark:border-gray-700 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{lesson.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {lesson.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{lesson.description}</div>
                          <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Saved Lessons */}
              {savedLessons.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Save className="w-5 h-5 text-emerald-600" />
                    My Lessons
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {savedLessons.map(lesson => (
                      <div key={lesson.id} className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-xl">{lesson.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{lesson.title}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{lesson.description}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startLesson(lesson)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Start
                          </button>
                          <button
                            onClick={() => deleteLesson(lesson.id)}
                            className="px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all hover:scale-105"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 space-y-6">
              {mode === 'edit' && (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Edit className="w-6 h-6 text-blue-600" />
                      Create Your Lesson
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        Import
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={saveLesson}
                        disabled={!customText.trim()}
                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => startLesson({ text: customText, title: 'Custom Text', icon: '✨' })}
                        disabled={!customText.trim()}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <Play className="w-4 h-4" />
                        Start Practice
                      </button>
                    </div>
                  </div>
                  <textarea
                    ref={textAreaRef}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="✨ Type or paste your custom text here... Load a template or import a .txt file to get started!"
                    className="w-full h-96 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    style={{
                      fontFamily: fontFamily === 'Mono' ? 'monospace' : fontFamily === 'Serif' ? 'serif' : 'sans-serif',
                      fontSize: `${fontSize}px`,
                      lineHeight: lineSpacing
                    }}
                  />
                </div>
              )}
              
              {mode === 'countdown' && (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-12 flex items-center justify-center min-h-[500px]">
                  <div className="text-center">
                    <div className="text-9xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-bounce mb-6">
                      {countdown}
                    </div>
                    <p className="text-2xl text-gray-600 dark:text-gray-400 font-semibold">Get Ready...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Position your fingers on the home row</p>
                  </div>
                </div>
              )}
              
              {mode === 'practice' && currentLesson && (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'WPM', value: wpm, icon: Zap, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-600 dark:text-blue-400' },
                      { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'from-emerald-500 to-teal-500', textColor: 'text-emerald-600 dark:text-emerald-400' },
                      { label: 'Time', value: formatTime(elapsedTime), icon: Clock, color: 'from-purple-500 to-pink-500', textColor: 'text-purple-600 dark:text-purple-400' },
                      { label: 'Mistakes', value: mistakes, icon: Trophy, color: 'from-rose-500 to-orange-500', textColor: 'text-rose-600 dark:text-rose-400' }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between mb-3">
                          <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                          <div className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                            {stat.label}
                          </div>
                        </div>
                        <div className={`text-4xl font-black ${stat.textColor}`}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Typing Area */}
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 lg:p-12">
                    <div
                      className={`${fontClasses[fontFamily]} select-none leading-relaxed text-center`}
                      style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: lineSpacing
                      }}
                    >
                      {renderText()}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {currentIndex} / {currentLesson.text.length}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                        style={{ width: `${(currentIndex / currentLesson.text.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => setMode('edit')}
                      className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 text-lg font-bold"
                    >
                      <Pause className="w-6 h-6" />
                      Stop Practice
                    </button>
                  </div>
                </>
              )}
              
              {mode === 'complete' && (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 lg:p-12">
                  <div className="text-center mb-10">
                    <div className="text-7xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                      Lesson Complete!
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Fantastic work! Here are your results:</p>
                  </div>
                  
                  {/* Results Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                      { label: 'WPM', value: wpm, icon: Zap, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
                      { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
                      { label: 'Time', value: formatTime(elapsedTime), icon: Clock, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
                      { label: 'Mistakes', value: mistakes, icon: Trophy, color: 'from-rose-500 to-orange-500', bgColor: 'bg-rose-50 dark:bg-rose-900/20' }
                    ].map((stat, idx) => (
                      <div key={idx} className={`text-center p-8 ${stat.bgColor} rounded-2xl border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105`}>
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color} mb-4`}>
                          <stat.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{stat.label}</div>
                        <div className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => startLesson(currentLesson)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 text-lg font-bold"
                    >
                      <RotateCcw className="w-6 h-6" />
                      Try Again
                    </button>
                    <button
                      onClick={() => { setMode('edit'); setCurrentLesson(null); }}
                      className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 text-lg font-bold"
                    >
                      <Edit className="w-6 h-6" />
                      Edit Text
                    </button>
                    <button
                      onClick={exportAsCSV}
                      className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 text-lg font-bold"
                    >
                      <Download className="w-6 h-6" />
                      Export CSV
                    </button>
                    <button
                      onClick={copyResults}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 text-lg font-bold"
                    >
                      <Copy className="w-6 h-6" />
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTypingLesson