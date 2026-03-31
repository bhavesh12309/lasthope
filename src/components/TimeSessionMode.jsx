import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, Settings, Type, Moon, Sun } from 'lucide-react';

const TimeSessionMode = () => {
  const [selectedTime, setSelectedTime] = useState(60);
  const [customTime, setCustomTime] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [fontSize, setFontSize] = useState('base');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundType, setSoundType] = useState('beep');
  const inputRef = useRef(null);
  const startTimeRef = useRef(null);
  const audioContextRef = useRef(null);

  const sampleText = "The quick brown fox jumps over the lazy dog. Practice makes perfect. Keep typing to improve your speed and accuracy. Focus on the rhythm of your keystrokes. Don't look at the keyboard. Let your fingers remember the positions. Typing is a valuable skill that improves with consistent practice.";

  const timeOptions = [
    { label: '15s', value: 15 },
    { label: '30s', value: 30 },
    { label: '1 min', value: 60 },
    { label: '2 min', value: 120 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
  ];

  const fontSizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Base', value: 'base' },
    { label: 'Large', value: 'large' },
    { label: 'Extra Large', value: 'xl' },
  ];

  const fontSizeMap = {
    small: 'text-lg',
    base: 'text-2xl',
    large: 'text-3xl',
    xl: 'text-4xl',
  };

  const playKeySound = (isCorrect) => {
    if (!soundEnabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    
    if (soundType === 'beep') {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (isCorrect) {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      } else {
        oscillator.frequency.value = 400;
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      }
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + (isCorrect ? 0.1 : 0.15));
    } else if (soundType === 'pop') {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = 'sine';
      
      if (isCorrect) {
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
      } else {
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
      }
    } else if (soundType === 'chime') {
      const oscillator1 = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode1 = ctx.createGain();
      const gainNode2 = ctx.createGain();
      
      oscillator1.connect(gainNode1);
      oscillator2.connect(gainNode2);
      gainNode1.connect(ctx.destination);
      gainNode2.connect(ctx.destination);
      
      if (isCorrect) {
        oscillator1.frequency.value = 1000;
        oscillator2.frequency.value = 1500;
        gainNode1.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode2.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator1.start(ctx.currentTime);
        oscillator2.start(ctx.currentTime);
        oscillator1.stop(ctx.currentTime + 0.2);
        oscillator2.stop(ctx.currentTime + 0.2);
      } else {
        oscillator1.frequency.value = 600;
        oscillator2.frequency.value = 800;
        gainNode1.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode2.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        oscillator1.start(ctx.currentTime);
        oscillator2.start(ctx.currentTime);
        oscillator1.stop(ctx.currentTime + 0.25);
        oscillator2.stop(ctx.currentTime + 0.25);
      }
    } else if (soundType === 'digital') {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = 'square';
      
      if (isCorrect) {
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.12);
      } else {
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.setValueAtTime(200, ctx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsFinished(true);
            calculateFinalStats();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  useEffect(() => {
    if (isActive && !isPaused) {
      calculateStats();
    }
  }, [typedText]);

  const calculateStats = () => {
    if (!startTimeRef.current) return;

    const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    const correctChars = typedText.split('').filter((char, i) => char === sampleText[i]).length;
    const totalChars = typedText.length;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const wordsTyped = correctChars / 5;
    const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

    setStats({ wpm, accuracy, correctChars, totalChars });
  };

  const calculateFinalStats = () => {
    if (!startTimeRef.current) return;
    
    const timeElapsed = (selectedTime - timeLeft) / 60;
    const correctChars = typedText.split('').filter((char, i) => char === sampleText[i]).length;
    const totalChars = typedText.length;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const wordsTyped = correctChars / 5;
    const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

    setStats({ wpm, accuracy, correctChars, totalChars });
  };

  const handleStart = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();
      inputRef.current?.focus();
    } else if (isPaused) {
      setIsPaused(false);
      inputRef.current?.focus();
    } else {
      setIsPaused(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(selectedTime);
    setTypedText('');
    setStats({ wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0 });
    setIsFinished(false);
    startTimeRef.current = null;
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeLeft(time);
    setIsCustom(false);
    handleReset();
  };

  const handleCustomTime = () => {
    const time = parseInt(customTime);
    if (time > 0 && time <= 3600) {
      setSelectedTime(time);
      setTimeLeft(time);
      setIsCustom(true);
      handleReset();
    }
  };

  const handleTextChange = (e) => {
    if (!isActive || isPaused || isFinished) return;
    const newText = e.target.value;
    
    if (newText.length > typedText.length) {
      const newCharIndex = newText.length - 1;
      const isCorrect = newText[newCharIndex] === sampleText[newCharIndex];
      playKeySound(isCorrect);
    }
    
    setTypedText(newText);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCharClass = (index) => {
    if (index >= typedText.length) return isDarkMode ? 'text-gray-600' : 'text-gray-400';
    return typedText[index] === sampleText[index] ? 'text-green-600' : 'text-red-600 bg-red-100';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 p-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Controls */}
        <div className="flex justify-end items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-lg transition-all flex items-center gap-2 font-medium ${
              isDarkMode
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                : 'bg-white text-gray-800 hover:bg-gray-100 shadow-md'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-5 h-5" /> Light
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" /> Dark
              </>
            )}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-lg transition-all flex items-center gap-2 font-medium ${
              soundEnabled
                ? isDarkMode ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-gray-100 shadow-md'
                : isDarkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
          >
            {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>
          {soundEnabled && (
            <select
              value={soundType}
              onChange={(e) => setSoundType(e.target.value)}
              className={`p-3 rounded-lg transition-all font-medium border-0 cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white text-gray-800 hover:bg-gray-100 shadow-md'
              }`}
            >
              <option value="beep">🔔 Beep</option>
              <option value="pop">💥 Pop</option>
              <option value="chime">🎵 Chime</option>
              <option value="digital">⚡ Digital</option>
            </select>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 flex items-center justify-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <Clock className="w-10 h-10 text-indigo-600" />
            Time Session Mode
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Choose your time and start typing!</p>
        </div>

        {/* Time Selection */}
        {!isActive && !isFinished && (
          <div className={`rounded-2xl shadow-lg p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <Settings className="w-5 h-5" />
              Select Time Duration
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeSelect(option.value)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedTime === option.value && !isCustom
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="Custom (seconds)"
                className={`flex-1 px-4 py-3 border-2 rounded-lg focus:border-indigo-500 focus:outline-none ${
                  isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
                }`}
                min="1"
                max="3600"
              />
              <button
                onClick={handleCustomTime}
                disabled={!customTime || parseInt(customTime) <= 0}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Set Custom
              </button>
            </div>
          </div>
        )}

        {/* Font Size Selection */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <Type className="w-5 h-5" />
            Font Size
          </h2>
          <div className="flex flex-wrap gap-3">
            {fontSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFontSize(option.value)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  fontSize === option.value
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`rounded-xl shadow-md p-4 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-indigo-600">{formatTime(timeLeft)}</div>
            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time Left</div>
          </div>
          <div className={`rounded-xl shadow-md p-4 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-green-600">{stats.wpm}</div>
            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>WPM</div>
          </div>
          <div className={`rounded-xl shadow-md p-4 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-blue-600">{stats.accuracy}%</div>
            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
          </div>
          <div className={`rounded-xl shadow-md p-4 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-purple-600">{stats.correctChars}/{stats.totalChars}</div>
            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Characters</div>
          </div>
        </div>

        {/* Typing Area */}
        <div className={`rounded-2xl shadow-lg p-8 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`${fontSizeMap[fontSize]} leading-relaxed mb-6 font-mono`}>
            {sampleText.split('').map((char, index) => (
              <span key={index} className={getCharClass(index)}>
                {char}
              </span>
            ))}
          </div>
          
          <textarea
            ref={inputRef}
            value={typedText}
            onChange={handleTextChange}
            disabled={!isActive || isPaused || isFinished}
            className={`w-full h-32 p-4 border-2 rounded-lg focus:border-indigo-500 focus:outline-none font-mono text-lg ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 disabled:bg-gray-600 disabled:text-gray-400'
                : 'bg-white text-gray-800 border-gray-300 disabled:bg-gray-100'
            } disabled:cursor-not-allowed`}
            placeholder={!isActive ? "Click Start to begin typing..." : "Start typing here..."}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg"
          >
            {!isActive ? (
              <>
                <Play className="w-5 h-5" /> Start
              </>
            ) : isPaused ? (
              <>
                <Play className="w-5 h-5" /> Resume
              </>
            ) : (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" /> Reset
          </button>
        </div>

        {/* Finish Modal */}
        {isFinished && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-2xl p-8 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Time's Up! 🎉</h2>
              <div className="space-y-4 mb-6">
                <div className={`flex justify-between items-center p-4 rounded-lg ${isDarkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-50'}`}>
                  <span className={`font-medium ${isDarkMode ? 'text-green-200' : 'text-gray-700'}`}>Words Per Minute</span>
                  <span className="text-2xl font-bold text-green-600">{stats.wpm}</span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg ${isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}>
                  <span className={`font-medium ${isDarkMode ? 'text-blue-200' : 'text-gray-700'}`}>Accuracy</span>
                  <span className="text-2xl font-bold text-blue-600">{stats.accuracy}%</span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg ${isDarkMode ? 'bg-purple-900 bg-opacity-30' : 'bg-purple-50'}`}>
                  <span className={`font-medium ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>Characters Typed</span>
                  <span className="text-2xl font-bold text-purple-600">{stats.totalChars}</span>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TimeSessionMode;