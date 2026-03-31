import React, { forwardRef, useEffect, useImperativeHandle, useRef, useCallback, useMemo, useState } from 'react';

const TypingArea = forwardRef(({ text, userInput, currentIndex, onKeyPress, isActive }, ref) => {
  const hiddenInputRef = useRef(null);
  const typingAreaRef = useRef(null);
  const [showCursor, setShowCursor] = useState(true);
  const [shake, setShake] = useState(false);

  // Expose hidden input ref to parent
  useImperativeHandle(ref, () => hiddenInputRef.current);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);mm
    return () => clearInterval(interval);
  }, []);

  // Auto-focus when active
  useEffect(() => {
    if (isActive && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [isActive]);

  // Auto-scroll to current position
  useEffect(() => {
    if (typingAreaRef.current && currentIndex > 0) {
      const currentChar = typingAreaRef.current.querySelector(`[data-index="${currentIndex}"]`);
      if (currentChar) {
        currentChar.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isActive) return;

      // Allow only typing-related keys
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
        e.preventDefault();
      }

      if (e.key === 'Backspace') {
        // Trigger shake animation on backspace
        setShake(true);
        setTimeout(() => setShake(false), 300);
        return;
      }

      if (e.key.length === 1 || e.key === ' ') {
        const expectedChar = text[currentIndex];
        if (e.key !== expectedChar) {
          // Trigger shake animation on wrong key
          setShake(true);
          setTimeout(() => setShake(false), 300);
        }
        onKeyPress(e.key);
      }
    },
    [isActive, onKeyPress, text, currentIndex]
  );

  const stats = useMemo(() => {
    const totalTyped = currentIndex;
    const correctChars = userInput.slice(0, currentIndex).split('').filter((char, i) => char === text[i]).length;
    const incorrectChars = totalTyped - correctChars;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    const progress = text ? Math.round((currentIndex / text.length) * 100) : 0;

    return { progress, accuracy, correctChars, incorrectChars, totalTyped };
  }, [text, userInput, currentIndex]);

  const renderText = useCallback(() => {
    return text.split('').map((char, index) => {
      let className = 'inline-block transition-all duration-150 ';
      let showCursorHere = false;

      if (index < currentIndex) {
        const isCorrect = userInput[index] === char;
        className += isCorrect 
          ? 'text-green-600 dark:text-green-400 scale-100' 
          : 'text-red-600 dark:text-red-400 scale-110 font-semibold bg-red-100 dark:bg-red-900/30 rounded px-0.5';
      } else if (index === currentIndex) {
        className += 'text-gray-900 dark:text-gray-100 font-medium scale-105';
        showCursorHere = isActive && showCursor;
      } else {
        className += 'text-gray-400 dark:text-gray-500';
      }

      return (
        <span key={index} data-index={index} className="relative inline-block">
          <span className={className}>
            {char === ' ' ? '\u00A0' : char}
          </span>
          {showCursorHere && (
            <span className="absolute -right-0.5 top-0 bottom-0 w-0.5 bg-blue-500 dark:bg-blue-400 animate-pulse" />
          )}
        </span>
      );
    });
  }, [text, userInput, currentIndex, isActive, showCursor]);

  return (
    <div className="relative space-y-4">
      {/* Hidden input for capturing keystrokes */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Stats Bar */}
      {text && isActive && (
        <div className="flex gap-4 justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.progress}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.accuracy}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalTyped}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Characters</div>
            </div>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {stats.correctChars}
            </span>
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {stats.incorrectChars}
            </span>
          </div>
        </div>
      )}

      {/* Typing area */}
      <div
        ref={typingAreaRef}
        className={`typing-text p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 transition-all duration-300 cursor-text min-h-[240px] max-h-[400px] overflow-y-auto leading-relaxed text-lg font-mono shadow-inner ${
          isActive 
            ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20' 
            : 'border-gray-300 dark:border-gray-600 border-dashed'
        } ${shake ? 'animate-shake' : ''}`}
        onClick={() => hiddenInputRef.current?.focus()}
      >
        {text ? (
          <div className="select-none">
            {renderText()}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 italic text-center flex items-center justify-center h-full">
            <div>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p>Select a lesson to start typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {text && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Progress</span>
            <span className="flex items-center gap-2">
              <span>{currentIndex} / {text.length}</span>
              <span className="text-blue-600 dark:text-blue-400">{stats.progress}%</span>
            </span>
          </div>
          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${stats.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isActive && text && (
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Click the typing area or press "Start Typing" to begin
          </p>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .typing-text::-webkit-scrollbar {
          width: 8px;
        }
        .typing-text::-webkit-scrollbar-track {
          background: transparent;
        }
        .typing-text::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }
        .typing-text::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
});

TypingArea.displayName = 'TypingArea';

export default TypingArea;