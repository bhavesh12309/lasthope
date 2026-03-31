import React from 'react';
import { X, Trophy, Target, Clock, Zap, Award, RotateCcw, ChevronRight, Share2 } from 'lucide-react';

const ResultsModal = ({
  stats,
  lesson,
  onClose,
  onRetry,
  onNextLesson,
}) => {
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceRating = () => {
    const wpmScore = Math.min(stats.wpm / lesson.wpmTarget, 1) * 40;
    const accuracyScore = Math.min(stats.accuracy / lesson.accuracyTarget, 1) * 60;
    const totalScore = wpmScore + accuracyScore;

    if (totalScore >= 90) return { rating: 'Excellent!', color: 'text-green-500', stars: 3 };
    if (totalScore >= 75) return { rating: 'Great!', color: 'text-blue-500', stars: 2 };
    if (totalScore >= 60) return { rating: 'Good!', color: 'text-yellow-500', stars: 1 };
    return { rating: 'Keep Practicing!', color: 'text-orange-500', stars: 0 };
  };

  const performance = getPerformanceRating();

  const achievements = [];
  if (stats.wpm >= lesson.wpmTarget) achievements.push('Speed Target Reached!');
  if (stats.accuracy >= lesson.accuracyTarget) achievements.push('Accuracy Target Reached!');
  if (stats.accuracy === 100) achievements.push('Perfect Accuracy!');
  if (stats.wpm >= 60) achievements.push('Speed Demon!');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Lesson Complete!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{lesson.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Performance Rating */}
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <div className={`text-3xl font-bold ${performance.color} mb-2`}>
            {performance.rating}
          </div>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(3)].map((_, i) => (
              <Trophy
                key={i}
                className={`w-8 h-8 ${
                  i < performance.stars ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Your Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.wpm}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">WPM</div>
              <div className="text-xs text-gray-500 mt-1">
                Target: {lesson.wpmTarget}
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.accuracy}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">
                Target: {lesson.accuracyTarget}%
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatTime(stats.timeElapsed)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Time</div>
            </div>

            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Award className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.mistakes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Mistakes</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Achievements Unlocked!
            </h3>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-800 dark:text-white font-medium">
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRetry}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={onNextLesson}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                // Share functionality would go here
                if (navigator.share) {
                  navigator.share({
                    title: 'My Typing Results',
                    text: `I just completed "${lesson.title}" with ${stats.wpm} WPM and ${stats.accuracy}% accuracy!`,
                  });
                }
              }}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;