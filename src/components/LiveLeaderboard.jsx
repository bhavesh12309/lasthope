function LeaderboardScreen({ onBack, leaderboard }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-600 p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-6 px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-4xl font-bold text-white mb-8 text-center">🏆 Global Leaderboard</h2>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4">
            <div className="grid grid-cols-5 gap-4 text-white font-bold">
              <div>Rank</div>
              <div>Player</div>
              <div>WPM</div>
              <div>Accuracy</div>
              <div>Score</div>
            </div>
          </div>

          <div>
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg">No scores yet. Be the first to play!</p>
              </div>
            ) : (
              leaderboard.map((entry, idx) => (
                <div 
                  key={idx} 
                  className={`grid grid-cols-5 gap-4 p-4 border-b last:border-b-0 items-center ${
                    idx === 0 ? 'bg-yellow-50 font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`font-bold text-lg ${
                    idx === 0 ? 'text-yellow-600' : idx === 1 ? 'text-gray-500' : idx === 2 ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </div>
                  <div className="font-semibold text-gray-800">{entry.name}</div>
                  <div className="text-blue-600 font-bold">{entry.wpm}</div>
                  <div className="text-green-600 font-bold">{entry.accuracy}%</div>
                  <div className="text-yellow-600 font-bold text-lg">{entry.score}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
