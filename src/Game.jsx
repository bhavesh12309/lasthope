import { useState, useEffect, useCallback, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

// ✅ REMOVED the problematic code that was here
// The localStorage logic is now inside handleGameOver()

export function Game({ playerName, settings, onBackToMenu }) {
  const [gameState, setGameState] = useState({
    isPlaying: true,
    isPaused: false,
    health: 100,
    maxHealth: 100,
    score: 0,
    wave: 1,
    zombies: [],
    powerUps: [],
    currentInput: '',
    combo: 0,
    longestCombo: 0,
    zombiesKilled: 0,
    totalTypedChars: 0,
    totalErrors: 0,
    powerUpsUsed: 0,
    activePowerUps: {
      shield: 0,
      slowTime: 0
    },
    startTime: Date.now(),
    playerName,
    coins: 0,
    waveCoins: 0,
    showWaveTransition: false,
    damageBoost: false,
    speedBoost: false,
    autoShield: false,
    particles: []
  });

  const [gameOver, setGameOver] = useState(false);
  const [newCoins, setNewCoins] = useState(0);
  const [newXP, setNewXP] = useState(0);
  const [waveZombiesRemaining, setWaveZombiesRemaining] = useState(0);
  const [waveZombiesSpawned, setWaveZombiesSpawned] = useState(0);
  const lastFrameTime = useRef(Date.now());
  const gameLoopRef = useRef();

  const zombiesPerWave = 5 + gameState.wave * 2;

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const spawnInitialZombies = () => {
        const initialZombies = [];
        const count = Math.min(3, zombiesPerWave);
        for (let i = 0; i < count; i++) {
          initialZombies.push(createZombie(gameState.wave, []));
        }
        setGameState(prev => ({ ...prev, zombies: initialZombies }));
        setWaveZombiesSpawned(count);
        setWaveZombiesRemaining(zombiesPerWave - count);
      };

      spawnInitialZombies();
    }
  }, [gameState.wave, gameState.isPlaying, gameState.isPaused]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastFrameTime.current) / 16.67, 3);
      lastFrameTime.current = now;

      setGameState(prev => {
        let newState = { ...prev };
        const slowTimeActive = prev.activePowerUps.slowTime > now || prev.speedBoost;
        newState.zombies = updateZombiePositions(prev.zombies, deltaTime, slowTimeActive);

        newState.powerUps = prev.powerUps.map(p => ({ ...p, y: p.y + 0.02 * deltaTime }));
        newState.powerUps = newState.powerUps.filter(p => p.y < 95);
        newState.particles = updateParticles(prev.particles, deltaTime);

        if (checkZombieCollisions(newState.zombies)) {
          const shieldActive = prev.activePowerUps.shield > now || prev.autoShield;
          if (!shieldActive) {
            newState.health = Math.max(0, prev.health - 20);
            newState.combo = 0;
            newState.zombies = newState.zombies.filter(z => {
              if (z.direction === 'top') return z.y < 90;
              return !(z.x >= 45 && z.x <= 55 && z.y >= 85);
            });
          } else {
            if (prev.autoShield) {
              newState.autoShield = false;
              newState.activePowerUps = {
                ...prev.activePowerUps,
                shield: now + 5000
              };
            }
            newState.zombies = newState.zombies.filter(z => {
              if (z.direction === 'top') return z.y < 90;
              return !(z.x >= 45 && z.x <= 55 && z.y >= 85);
            });
          }
        }

        return newState;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState.isPlaying, gameState.isPaused]);

  useEffect(() => {
    if (gameState.health <= 0 && gameState.isPlaying) {
      handleGameOver();
    }
  }, [gameState.health, gameState.isPlaying]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.showWaveTransition) return;

    if (gameState.zombies.length === 0 && waveZombiesRemaining === 0 && gameState.wave > 0) {
      const rewards = getRewards(gameState.wave, calculateAccuracy(gameState.totalTypedChars, gameState.totalErrors));
      setGameState(prev => ({
        ...prev,
        showWaveTransition: true,
        waveCoins: rewards.coins,
        coins: prev.coins + rewards.coins
      }));
    }
  }, [gameState.zombies.length, waveZombiesRemaining, gameState.isPlaying, gameState.isPaused, gameState.showWaveTransition, gameState.wave]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    if (waveZombiesRemaining > 0 && gameState.zombies.length < 8) {
      const spawnDelay = Math.max(1000, 3000 - gameState.wave * 100);
      const timer = setTimeout(() => {
        const existingWords = gameState.zombies.map(z => z.word);
        const newZombie = createZombie(gameState.wave, existingWords);
        setGameState(prev => ({ ...prev, zombies: [...prev.zombies, newZombie] }));
        setWaveZombiesSpawned(prev => prev + 1);
        setWaveZombiesRemaining(prev => prev - 1);
      }, spawnDelay);
      return () => clearTimeout(timer);
    }
  }, [waveZombiesRemaining, gameState.zombies.length, gameState.wave, gameState.isPlaying, gameState.isPaused]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    if (Math.random() < 0.002 && gameState.powerUps.length < 2) {
      const newPowerUp = createPowerUp();
      setGameState(prev => ({ ...prev, powerUps: [...prev.powerUps, newPowerUp] }));
    }
  }, [gameState.zombies.length, gameState.isPlaying, gameState.isPaused]);

  const handleKeyPress = useCallback(
    e => {
      if (gameOver || !gameState.isPlaying) return;

      if (e.key === 'Escape') {
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
        return;
      }

      if (gameState.isPaused) return;

      if (e.key === 'Backspace') {
        setGameState(prev => ({
          ...prev,
          currentInput: prev.currentInput.slice(0, -1),
          zombies: prev.zombies.map(z => ({ ...z, isTargeted: false }))
        }));
        return;
      }

      if (e.key.length === 1 && /^[a-z\s]$/i.test(e.key)) {
        e.preventDefault();
        const newInput = (gameState.currentInput + e.key.toLowerCase()).trim();

        setGameState(prev => {
          let matched = false;

          for (let i = 0; i < prev.powerUps.length; i++) {
            const powerUp = prev.powerUps[i];
            if (powerUp.word.startsWith(newInput)) {
              matched = true;
              if (powerUp.word === newInput) {
                const updates = activatePowerUp(powerUp.type, prev);
                return {
                  ...prev,
                  ...updates,
                  powerUps: prev.powerUps.filter(p => p.id !== powerUp.id),
                  currentInput: '',
                  totalTypedChars: prev.totalTypedChars + 1
                };
              } else {
                return {
                  ...prev,
                  currentInput: newInput,
                  totalTypedChars: prev.totalTypedChars + 1,
                  powerUps: prev.powerUps.map(p =>
                    p.id === powerUp.id ? { ...p, typedChars: newInput.length } : { ...p, typedChars: 0 }
                  )
                };
              }
            }
          }

          if (!matched) {
            for (let i = 0; i < prev.zombies.length; i++) {
              const zombie = prev.zombies[i];
              if (zombie.word.startsWith(newInput)) {
                matched = true;
                if (zombie.word === newInput) {
                  const accuracy = calculateAccuracy(prev.totalTypedChars + 1, prev.totalErrors);
                  const points = calculateScore(zombie, prev.combo, accuracy);
                  const damage = prev.damageBoost ? 2 : 1;
                  const newHealth = zombie.health - damage;

                  if (newHealth <= 0) {
                    const newCombo = prev.combo + 1;
                    const killParticle = createParticle(zombie.x, zombie.y, 'kill', `+${points}`);
                    return {
                      ...prev,
                      zombies: prev.zombies.filter(z => z.id !== zombie.id),
                      score: prev.score + points,
                      combo: newCombo,
                      longestCombo: Math.max(prev.longestCombo, newCombo),
                      zombiesKilled: prev.zombiesKilled + 1,
                      currentInput: '',
                      totalTypedChars: prev.totalTypedChars + 1,
                      particles: [...prev.particles, killParticle]
                    };
                  } else {
                    const hitParticle = createParticle(zombie.x, zombie.y, 'hit');
                    return {
                      ...prev,
                      zombies: prev.zombies.map(z =>
                        z.id === zombie.id ? { ...z, health: newHealth, typedChars: 0, isTargeted: false } : z
                      ),
                      currentInput: '',
                      totalTypedChars: prev.totalTypedChars + 1,
                      particles: [...prev.particles, hitParticle]
                    };
                  }
                } else {
                  return {
                    ...prev,
                    currentInput: newInput,
                    totalTypedChars: prev.totalTypedChars + 1,
                    zombies: prev.zombies.map(z =>
                      z.id === zombie.id
                        ? { ...z, typedChars: newInput.length, isTargeted: true }
                        : { ...z, isTargeted: false }
                    )
                  };
                }
              }
            }
          }

          if (!matched) {
            return {
              ...prev,
              currentInput: newInput,
              totalTypedChars: prev.totalTypedChars + 1,
              totalErrors: prev.totalErrors + 1,
              combo: 0
            };
          }

          return prev;
        });
      }
    },
    [gameState, gameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleGameOver = async () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    setGameOver(true);

    const accuracy = calculateAccuracy(gameState.totalTypedChars, gameState.totalErrors);
    const wpm = calculateWPM(gameState.totalTypedChars, gameState.startTime);
    const rewards = getRewards(gameState.wave, accuracy);

    // ✅ Save best score to localStorage
    const bestScore = localStorage.getItem("bestScore") || 0;
    if (gameState.score > bestScore) {
      localStorage.setItem("bestScore", gameState.score);
      console.log("🎉 New high score saved locally!");
    }

    setNewCoins(rewards.coins);
    setNewXP(rewards.xp);

    try {
      await saveGameSession({
        player_name: playerName,
        score: gameState.score,
        waves_survived: gameState.wave,
        zombies_killed: gameState.zombiesKilled,
        accuracy,
        wpm,
        longest_combo: gameState.longestCombo,
        power_ups_used: gameState.powerUpsUsed
      });

      const existingStats = await getPlayerStats(playerName);

      const newStats = existingStats
        ? {
            ...existingStats,
            total_games: existingStats.total_games + 1,
            total_score: existingStats.total_score + gameState.score,
            highest_score: Math.max(existingStats.highest_score, gameState.score),
            total_zombies_killed: existingStats.total_zombies_killed + gameState.zombiesKilled,
            best_wave: Math.max(existingStats.best_wave, gameState.wave),
            best_accuracy: Math.max(existingStats.best_accuracy, accuracy),
            best_wpm: Math.max(existingStats.best_wpm, wpm),
            coins: existingStats.coins + rewards.coins,
            xp: existingStats.xp + rewards.xp,
            level: calculateLevel(existingStats.xp + rewards.xp),
            updated_at: new Date().toISOString()
          }
        : {
            player_name: playerName,
            total_games: 1,
            total_score: gameState.score,
            highest_score: gameState.score,
            total_zombies_killed: gameState.zombiesKilled,
            best_wave: gameState.wave,
            best_accuracy: accuracy,
            best_wpm: wpm,
            coins: rewards.coins,
            xp: rewards.xp,
            level: calculateLevel(rewards.xp),
            unlocked_backgrounds: ['default'],
            unlocked_weapons: ['pistol'],
            settings: {
              bloodEffects: true,
              musicVolume: 70,
              sfxVolume: 80,
              fontSize: 'medium'
            }
          };

      await upsertPlayerStats(newStats);
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  };

  const handleWaveContinue = purchasedItems => {
    setGameState(prev => ({
      ...prev,
      wave: prev.wave + 1,
      health: purchasedItems.healthBoost
        ? Math.min(prev.maxHealth, prev.health + 50)
        : Math.min(prev.maxHealth, prev.health + 20),
      showWaveTransition: false,
      damageBoost: purchasedItems.damageBoost || false,
      speedBoost: purchasedItems.speedBoost || false,
      autoShield: purchasedItems.autoShield || false,
      coins: prev.coins - Object.values(purchasedItems).filter(Boolean).length * 200
    }));
    setWaveZombiesSpawned(0);
    setWaveZombiesRemaining(0);
  };

  const handleRestart = () => {
    setGameOver(false);
    setGameState({
      isPlaying: true,
      isPaused: false,
      health: 100,
      maxHealth: 100,
      score: 0,
      wave: 1,
      zombies: [],
      powerUps: [],
      currentInput: '',
      combo: 0,
      longestCombo: 0,
      zombiesKilled: 0,
      totalTypedChars: 0,
      totalErrors: 0,
      powerUpsUsed: 0,
      activePowerUps: {
        shield: 0,
        slowTime: 0
      },
      startTime: Date.now(),
      playerName,
      coins: 0,
      waveCoins: 0,
      showWaveTransition: false,
      damageBoost: false,
      speedBoost: false,
      autoShield: false,
      particles: []
    });
    setWaveZombiesRemaining(0);
    setWaveZombiesSpawned(0);
  };

  if (gameOver) {
    return (
      <GameOver
        gameState={gameState}
        onRestart={handleRestart}
        onMenu={onBackToMenu}
        newCoins={newCoins}
        newXP={newXP}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h60v60H0z%22 fill=%22none%22/%3E%3Cpath d=%22M30 0L0 30l30 30 30-30z%22 fill=%22%23fff%22 opacity=%22.1%22/%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-gray-700 opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            🌫️
          </div>
        ))}
      </div>

      <GameHUD gameState={gameState} />

      <div className="relative h-screen">
        {gameState.zombies.map(zombie => (
          <Zombie
            key={zombie.id}
            zombie={zombie}
            fontSize={settings.fontSize}
            bloodEffects={settings.bloodEffects}
          />
        ))}

        {gameState.powerUps.map(powerUp => (
          <PowerUpDisplay key={powerUp.id} powerUp={powerUp} fontSize={settings.fontSize} />
        ))}

        <ParticleSystem particles={gameState.particles} />

        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-6xl">🏚️</div>
      </div>

      <InputDisplay currentInput={gameState.currentInput} fontSize={settings.fontSize} />

      {gameState.showWaveTransition && (
        <WaveTransition
          wave={gameState.wave}
          score={gameState.score}
          coins={gameState.coins}
          earnedCoins={gameState.waveCoins}
          onContinue={handleWaveContinue}
        />
      )}

      {gameState.isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-white font-bold mb-6">Paused</h2>
          <button
            onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold mb-4"
          >
            Resume
          </button>
          <button
            onClick={onBackToMenu}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Main Menu
          </button>
        </div>
      )}

      {!gameOver && (
        <button
          onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
          className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white transition-transform hover:scale-110"
        >
          {gameState.isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
      )}
    </div>
  );
}

export default Game;