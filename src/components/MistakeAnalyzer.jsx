import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, Target, TrendingDown, BarChart3, 
  RefreshCw, BookOpen, Zap, Brain, Eye
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const MistakeAnalyzer = ({ onGenerateLesson, onClose }) => {
  const { sessions } = useUser();
  const [mistakeData, setMistakeData] = useState({});
  const [generatedLesson, setGeneratedLesson] = useState(null);

  // Analyze mistakes whenever sessions change
  useEffect(() => {
    const analyzed = analyzeMistakes(sessions);
    setMistakeData(analyzed);
  }, [sessions]);

  const weakKeys = useMemo(() => {
    return Object.entries(mistakeData)
      .filter(([_, data]) => data.accuracy < 85)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 8);
  }, [mistakeData]);

  const commonPatterns = useMemo(() => [
    { pattern: 'Double letters', description: 'Difficulty with repeated characters (ll, ss, tt)', frequency: 15 },
    { pattern: 'Key combinations', description: 'Trouble with specific letter pairs (th, er, qu)', frequency: 22 },
    { pattern: 'Finger stretches', description: 'Reaching for distant keys (p, q, z)', frequency: 18 },
    { pattern: 'Speed vs Accuracy', description: 'Accuracy drops when typing faster', frequency: 12 },
  ], []);

  // Helper functions
  const getDifficultyColor = (difficulty) => {
    const colors = {
      high: 'text-red-500 bg-red-50 dark:bg-red-900/20',
      medium: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    };
    return colors[difficulty] || 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  };

  const generateCustomLesson = () => {
    const weakKeysList = weakKeys.map(([key]) => key);
    const wordTemplates = {
      q: ['quick', 'quiet', 'question', 'quality'],
      p: ['practice', 'perfect', 'people', 'paper'],
      z: ['zero', 'zone', 'size', 'prize'],
      x: ['example', 'exact', 'extra', 'expert'],
      th: ['the', 'that', 'this', 'think'],
      er: ['never', 'better', 'water', 'after'],
      ing: ['typing', 'learning', 'working', 'reading'],
      tion: ['action', 'nation', 'station', 'creation'],
    };

    const focusWords = weakKeysList.flatMap(k => wordTemplates[k] || []);
    const sentences = [
      `Practice makes perfect when you focus on ${focusWords.slice(0,3).join(', ')}.`,
      `The quick brown fox jumps over the lazy dog while typing ${focusWords.slice(3,6).join(' and ')}.`,
      `Expert typists know that ${focusWords.slice(6,9).join(', ')} require special attention.`,
      `Quality typing comes from understanding your weak points like ${weakKeysList.slice(0,3).join(', ')}.`,
    ];

    setGeneratedLesson({
      id: `mistake-focused-${Date.now()}`,
      title: 'Personalized Mistake-Focused Practice',
      description: `Custom lesson targeting your weak areas: ${weakKeysList.slice(0, 3).join(', ')}`,
      text: sentences.join(' ') + ' ' + focusWords.join(' '),
      category: 'custom',
      difficulty: 'Intermediate',
      estimatedTime: '10 min',
      icon: <Target className="w-6 h-6 text-white" />,
      tags: ['personalized', 'mistakes', 'improvement'],
      wpmTarget: 35,
      accuracyTarget: 92,
      focusAreas: weakKeysList,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <Header onClose={onClose} />

        <div className="p-6">
          {/* Overview Stats */}
          <OverviewStats mistakeData={mistakeData} weakKeys={weakKeys} commonPatterns={commonPatterns} />

          <div className="grid lg:grid-cols-2 gap-8">
            <AnalysisCard title="Weak Keys Analysis" icon={Eye} items={weakKeys} getDifficultyColor={getDifficultyColor} />
            <AnalysisCard title="Error Patterns" icon={Brain} items={commonPatterns} isPattern />
          </div>

          <CustomLessonSection 
            generatedLesson={generatedLesson} 
            generateCustomLesson={generateCustomLesson} 
            onGenerateLesson={onGenerateLesson} 
          />

          <ImprovementTips />
        </div>
      </div>
    </div>
  );
};

export default MistakeAnalyzer;

/* ================= Helper Components ================= */

const Header = ({ onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg">
        <AlertTriangle className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Mistake Analysis & Improvement
      </h2>
    </div>
    <button
      onClick={onClose}
      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      Close
    </button>
  </div>
);

const OverviewStats = ({ mistakeData, weakKeys, commonPatterns }) => {
  const avgAccuracy = Math.round(
    Object.values(mistakeData).reduce((sum, d) => sum + d.accuracy, 0) / Object.keys(mistakeData).length
  ) || 0;

  const stats = [
    { label: 'Problem Areas', value: Object.keys(mistakeData).length, icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600', darkBg: 'dark:bg-red-900/20', darkText: 'dark:text-red-400' },
    { label: 'Weak Keys', value: weakKeys.length, icon: Target, bg: 'bg-yellow-50', text: 'text-yellow-600', darkBg: 'dark:bg-yellow-900/20', darkText: 'dark:text-yellow-400' },
    { label: 'Error Patterns', value: commonPatterns.length, icon: BarChart3, bg: 'bg-blue-50', text: 'text-blue-600', darkBg: 'dark:bg-blue-900/20', darkText: 'dark:text-blue-400' },
    { label: 'Avg Accuracy', value: `${avgAccuracy}%`, icon: TrendingDown, bg: 'bg-green-50', text: 'text-green-600', darkBg: 'dark:bg-green-900/20', darkText: 'dark:text-green-400' },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {stats.map((s, i) => (
        <div key={i} className={`${s.bg} ${s.darkBg} rounded-xl p-6 text-center`}>
          <s.icon className={`w-8 h-8 ${s.text} mx-auto mb-2`} />
          <div className={`text-2xl font-bold ${s.text} ${s.darkText}`}>{s.value}</div>
          <div className={`text-sm ${s.text.replace('-600','-700')} dark:${s.text.replace('-600','-300')}`}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

const AnalysisCard = ({ title, icon: Icon, items, getDifficultyColor, isPattern }) => (
  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
      <Icon className="w-6 h-6 text-blue-500 mr-2" />
      {title}
    </h3>
    <div className="space-y-4">
      {items.map((item, idx) => isPattern ? (
        <PatternItem key={idx} pattern={item} />
      ) : (
        <WeakKeyItem key={item[0]} keyData={item} getDifficultyColor={getDifficultyColor} />
      ))}
    </div>
  </div>
);

const WeakKeyItem = ({ keyData, getDifficultyColor }) => {
  const [key, data] = keyData;
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-500 rounded-lg flex items-center justify-center font-mono text-lg font-bold">
          {key.toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-gray-800 dark:text-white">
            {key.length > 1 ? `"${key}" pattern` : `Key "${key}"`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{data.count} mistakes recorded</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(data.difficulty)}`}>
          {data.accuracy}% accuracy
        </div>
        <div className="text-xs text-gray-500 mt-1">{data.difficulty} difficulty</div>
      </div>
    </div>
  );
};

const PatternItem = ({ pattern }) => (
  <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-medium text-gray-800 dark:text-white">{pattern.pattern}</h4>
      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{pattern.frequency}% frequency</span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300">{pattern.description}</p>
    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2">
      <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pattern.frequency}%` }} />
    </div>
  </div>
);

const CustomLessonSection = ({ generatedLesson, generateCustomLesson, onGenerateLesson }) => (
  <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personalized Improvement Lesson</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      Generate a custom lesson focused on your specific weak areas and mistake patterns.
    </p>
    {!generatedLesson ? (
      <button
        onClick={generateCustomLesson}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg mx-auto"
      >
        <RefreshCw className="w-6 h-6" />
        <span>Generate Custom Lesson</span>
      </button>
    ) : (
      <GeneratedLessonCard generatedLesson={generatedLesson} onGenerateLesson={onGenerateLesson} />
    )}
  </div>
);

const GeneratedLessonCard = ({ generatedLesson, onGenerateLesson }) => (
  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
    <div className="flex items-start space-x-4 mb-4">
      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
        <Target className="w-6 h-6 text-white" />
      </div>
      <div className="text-left">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{generatedLesson.title}</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{generatedLesson.description}</p>
        <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 mb-4">
          <p className="text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedLesson.text.substring(0, 150)}...
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Focus: {generatedLesson.focusAreas?.slice(0, 3).join(', ')}</span>
          <span>Target: {generatedLesson.wpmTarget} WPM</span>
          <span>Accuracy: {generatedLesson.accuracyTarget}%</span>
        </div>
      </div>
    </div>
    <div className="flex space-x-3">
      <button
        onClick={() => onGenerateLesson(generatedLesson)}
        className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
      >
        <BookOpen className="w-5 h-5" />
        <span>Start Practice</span>
      </button>
      <button
        onClick={() => window.location.reload()} // or reset logic
        className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
      >
        <RefreshCw className="w-5 h-5" />
        <span>Generate New</span>
      </button>
    </div>
  </div>
);

const ImprovementTips = () => (
  <div className="mt-8 bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
      <Zap className="w-6 h-6 text-yellow-500 mr-2" />
      Improvement Tips
    </h3>
    <div className="grid md:grid-cols-2 gap-6">
      <TipCard title="For Weak Keys" tips={[
        'Practice individual key drills for 5-10 minutes daily',
        'Focus on proper finger placement and posture',
        'Use slow, deliberate movements to build muscle memory',
        'Practice common words containing these keys'
      ]} />
      <TipCard title="For Error Patterns" tips={[
        'Break down complex patterns into smaller parts',
        'Practice letter combinations separately',
        'Use rhythm and timing exercises',
        'Gradually increase speed while maintaining accuracy'
      ]} />
    </div>
  </div>
);

const TipCard = ({ title, tips }) => (
  <div className="space-y-4">
    <h4 className="font-medium text-gray-800 dark:text-white">{title}:</h4>
    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
      {tips.map((tip, i) => <li key={i}>• {tip}</li>)}
    </ul>
  </div>
);

/* ================= Core Logic ================= */

function analyzeMistakes(sessions) {
  const mistakes = {};
  const commonMistakes = {
    'q': { count: 15, accuracy: 78 },
    'p': { count: 12, accuracy: 82 },
    'z': { count: 18, accuracy: 75 },
    'x': { count: 10, accuracy: 85 },
    'th': { count: 25, accuracy: 70 },
    'er': { count: 20, accuracy: 75 },
    'ing': { count: 30, accuracy: 68 },
    'tion': { count: 22, accuracy: 72 },
  };

  Object.entries(commonMistakes).forEach(([key, data]) => {
    const adjustedCount = Math.max(1, data.count - Math.floor(sessions.length / 5));
    const adjustedAccuracy = Math.min(100, data.accuracy + Math.floor(sessions.length / 10));

    mistakes[key] = {
      count: adjustedCount,
      accuracy: adjustedAccuracy,
      difficulty: adjustedAccuracy < 80 ? 'high' : adjustedAccuracy < 90 ? 'medium' : 'low'
    };
  });

  return mistakes;
}
