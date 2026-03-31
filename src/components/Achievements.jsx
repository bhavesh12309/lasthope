import React, { useState, useEffect, useRef } from 'react';
import { Heart, Flame, Award, ArrowLeft, Trophy, ShoppingCart, Coins, Zap, Star } from 'lucide-react';

const TypingGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [currentScene, setCurrentScene] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [health, setHealth] = useState(100);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(5000);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState('featured');
  const [purchases, setPurchases] = useState({});
  const [selectedTheme, setSelectedTheme] = useState('t1');
  const [selectedFont, setSelectedFont] = useState('f1');
  const [selectedPet, setSelectedPet] = useState('');
  const [typingStats, setTypingStats] = useState({ wpm: 0, maxWpm: 0, totalTyped: 0 });
  const [showProfile, setShowProfile] = useState(false);
  const [level, setLevel] = useState(1);
  const inputRef = useRef(null);
  const startTimeRef = useRef(0);

  const themeMap = {
    t1: { bg: 'from-slate-950 via-purple-950 to-slate-950', text: 'text-white' },
    t2: { bg: 'from-slate-100 via-purple-100 to-slate-100', text: 'text-black' },
    t3: { bg: 'from-green-950 via-black to-green-950', text: 'text-green-400' },
    t4: { bg: 'from-green-50 via-emerald-50 to-green-50', text: 'text-green-900' },
    t5: { bg: 'from-orange-950 via-red-900 to-orange-950', text: 'text-orange-100' },
    t6: { bg: 'from-pink-900 via-purple-900 to-pink-900', text: 'text-pink-100' },
    t7: { bg: 'from-cyan-950 via-blue-950 to-cyan-950', text: 'text-cyan-100' },
    t8: { bg: 'from-gray-800 via-gray-900 to-gray-800', text: 'text-gray-100' },
  };

  const fontMap = {
    f1: { fontFamily: 'Arial, sans-serif' },
    f2: { fontFamily: 'Courier New, monospace', letterSpacing: '2px' },
    f3: { fontFamily: 'Georgia, serif' },
    f4: { fontFamily: 'monospace', fontWeight: 'bold' },
    f5: { fontFamily: 'cursive', fontSize: '1.1em' },
    f6: { fontFamily: 'monospace', fontSize: '0.95em' },
    f7: { fontFamily: 'serif', fontWeight: 'bold', letterSpacing: '1px' },
    f8: { fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.05em', letterSpacing: '3px' },
  };

  const shopCategories = {
    featured: { icon: '⭐', label: 'Featured' },
    backgrounds: { icon: '🎨', label: 'Backgrounds' },
    fonts: { icon: '✍️', label: 'Fonts' },
    effects: { icon: '✨', label: 'Effects' },
    sound: { icon: '🔊', label: 'Sound' },
    cosmetics: { icon: '👑', label: 'Cosmetics' },
    upgrades: { icon: '⭐', label: 'Upgrades' },
    themes: { icon: '🎭', label: 'Themes' },
    pets: { icon: '🐉', label: 'Pets' },
  };

  const allItems = {
    featured: [
      { id: 'bundle1', name: '🎁 Starter Pack', cost: 500, desc: '5 items', rarity: 'epic' },
      { id: 'boost1', name: '💰 Coin Rush', cost: 800, desc: '3x coins', rarity: 'epic' },
      { id: 'pass1', name: '🏆 Premium', cost: 1000, desc: 'All items', rarity: 'legendary' },
    ],
    backgrounds: [
      { id: 'bg1', name: 'Classic', cost: 0, desc: 'Default', rarity: 'common' },
      { id: 'bg2', name: 'Desert', cost: 150, desc: 'Golden sands', rarity: 'common' },
      { id: 'bg3', name: 'Cyber', cost: 150, desc: 'Neon glow', rarity: 'common' },
      { id: 'bg4', name: 'Forest', cost: 150, desc: 'Nature', rarity: 'common' },
      { id: 'bg5', name: 'Fire', cost: 200, desc: 'Flames', rarity: 'rare' },
      { id: 'bg6', name: 'Void', cost: 250, desc: 'Darkness', rarity: 'rare' },
      { id: 'bg7', name: 'Ocean', cost: 180, desc: 'Waters', rarity: 'common' },
      { id: 'bg8', name: 'Aurora', cost: 220, desc: 'Lights', rarity: 'rare' },
      { id: 'bg9', name: 'Galaxy', cost: 280, desc: 'Stars', rarity: 'epic' },
      { id: 'bg10', name: 'Crystal', cost: 240, desc: 'Gems', rarity: 'rare' },
    ],
    fonts: [
      { id: 'f1', name: 'Standard', cost: 0, desc: 'Clear', rarity: 'common' },
      { id: 'f2', name: 'Retro', cost: 100, desc: 'Pixel', rarity: 'common' },
      { id: 'f3', name: 'Ancient', cost: 100, desc: 'Historic', rarity: 'common' },
      { id: 'f4', name: 'Tech', cost: 130, desc: 'Code', rarity: 'common' },
      { id: 'f5', name: 'Script', cost: 120, desc: 'Fancy', rarity: 'rare' },
      { id: 'f6', name: 'Future', cost: 150, desc: 'Modern', rarity: 'rare' },
      { id: 'f7', name: 'Gothic', cost: 140, desc: 'Dark', rarity: 'rare' },
      { id: 'f8', name: 'Diamond', cost: 200, desc: 'Shine', rarity: 'epic' },
    ],
    effects: [
      { id: 'e1', name: 'None', cost: 0, desc: 'Standard', rarity: 'common' },
      { id: 'e2', name: 'Glow', cost: 120, desc: 'Radiant', rarity: 'common' },
      { id: 'e3', name: 'Particle', cost: 180, desc: 'Dust', rarity: 'rare' },
      { id: 'e4', name: 'Burst', cost: 200, desc: 'Energy', rarity: 'rare' },
      { id: 'e5', name: 'Electric', cost: 160, desc: 'Lightning', rarity: 'rare' },
      { id: 'e6', name: 'Flame', cost: 170, desc: 'Fire', rarity: 'rare' },
      { id: 'e7', name: 'Frost', cost: 150, desc: 'Ice', rarity: 'rare' },
      { id: 'e8', name: 'Rainbow', cost: 250, desc: 'Colors', rarity: 'epic' },
    ],
    sound: [
      { id: 's1', name: 'Silent', cost: 0, desc: 'Mute', rarity: 'common' },
      { id: 's2', name: 'Magic', cost: 80, desc: 'Spells', rarity: 'common' },
      { id: 's3', name: 'Sci-Fi', cost: 100, desc: 'Beeps', rarity: 'common' },
      { id: 's4', name: 'Nature', cost: 90, desc: 'Forest', rarity: 'common' },
      { id: 's5', name: 'Retro', cost: 110, desc: 'Arcade', rarity: 'rare' },
      { id: 's6', name: 'Cosmic', cost: 120, desc: 'Space', rarity: 'rare' },
      { id: 's7', name: 'Orchestra', cost: 180, desc: 'Symphony', rarity: 'epic' },
      { id: 's8', name: 'Techno', cost: 150, desc: 'Beat', rarity: 'rare' },
    ],
    cosmetics: [
      { id: 'c1', name: 'Knight', cost: 150, desc: 'Warrior', rarity: 'rare' },
      { id: 'c2', name: 'Mage', cost: 150, desc: 'Wizard', rarity: 'rare' },
      { id: 'c3', name: 'Rogue', cost: 150, desc: 'Stealth', rarity: 'rare' },
      { id: 'c4', name: 'Phoenix', cost: 200, desc: 'Fire', rarity: 'epic' },
      { id: 'c5', name: 'Dragon', cost: 250, desc: 'Ultimate', rarity: 'epic' },
      { id: 'c6', name: 'Title Master', cost: 100, desc: 'Badge', rarity: 'common' },
      { id: 'c7', name: 'Title Legend', cost: 200, desc: 'Epic', rarity: 'epic' },
      { id: 'c8', name: 'Border Gold', cost: 120, desc: 'Luxury', rarity: 'rare' },
    ],
    upgrades: [
      { id: 'u1', name: 'Health +25', cost: 200, desc: 'Durable', rarity: 'common' },
      { id: 'u2', name: 'Combo +10%', cost: 250, desc: 'Mastery', rarity: 'rare' },
      { id: 'u3', name: 'Speed +15%', cost: 200, desc: 'Fast', rarity: 'rare' },
      { id: 'u4', name: 'Accuracy +5%', cost: 180, desc: 'Precise', rarity: 'common' },
      { id: 'u5', name: 'Coins 1.5x', cost: 300, desc: 'Rush', rarity: 'epic' },
      { id: 'u6', name: 'Coins 2x', cost: 500, desc: 'Overflow', rarity: 'epic' },
      { id: 'u7', name: 'Time +3s', cost: 220, desc: 'Extension', rarity: 'rare' },
      { id: 'u8', name: 'WPM 2x', cost: 400, desc: 'Hyper', rarity: 'epic' },
    ],
    themes: [
      { id: 't1', name: 'Dark', cost: 0, desc: 'Default', rarity: 'common' },
      { id: 't2', name: 'Light', cost: 100, desc: 'Bright', rarity: 'common' },
      { id: 't3', name: 'Hacker', cost: 120, desc: 'Matrix', rarity: 'rare' },
      { id: 't4', name: 'Mint', cost: 110, desc: 'Fresh', rarity: 'common' },
      { id: 't5', name: 'Sunset', cost: 130, desc: 'Warm', rarity: 'rare' },
      { id: 't6', name: 'Neon', cost: 150, desc: 'Bright', rarity: 'epic' },
      { id: 't7', name: 'Cyber', cost: 160, desc: 'Tech', rarity: 'epic' },
      { id: 't8', name: 'Minimal', cost: 120, desc: 'Clean', rarity: 'rare' },
    ],
    pets: [
      { id: 'p1', name: 'Dragon', cost: 400, desc: 'Loyal', rarity: 'epic' },
      { id: 'p2', name: 'Phoenix', cost: 350, desc: 'Fire', rarity: 'epic' },
      { id: 'p3', name: 'Unicorn', cost: 300, desc: 'Magic', rarity: 'rare' },
      { id: 'p4', name: 'Shadow', cost: 380, desc: 'Dark', rarity: 'epic' },
    ],
  };

  const eras = [
    { name: 'Egypt', symbol: '🏜️' },
    { name: 'Cyberpunk', symbol: '🌆' },
    { name: 'Fantasy', symbol: '🏰' },
  ];

  const scenes = [
    { type: 'narrative', text: 'Deserts await your conquest.', prompt: 'the darkness fades', difficulty: 1 },
    { type: 'battle', text: 'Stone Guardian attacks!', prompt: 'lightning reflexes now', difficulty: 2, time: 8 },
    { type: 'quicktime', text: 'Pyramid collapses!', prompt: 'run escape now', difficulty: 1.8, time: 6 },
    { type: 'narrative', text: 'Desert path leads onward.', prompt: 'gate opens wide', difficulty: 1.4 },
    { type: 'dialogue', text: 'Guardian speaks to you.', prompt: 'I claim the stone', difficulty: 1.5 },
    { type: 'narrative', text: 'Cyberpunk city glows.', prompt: 'digital dreams begin', difficulty: 1.5 },
    { type: 'battle', text: 'Security drones deploy!', prompt: 'drones fall silent', difficulty: 2.2, time: 7 },
    { type: 'quicktime', text: 'Firewalls collapse!', prompt: 'shatter the chains', difficulty: 2.3, time: 7 },
    { type: 'narrative', text: 'City stabilizes ahead.', prompt: 'enter the portal', difficulty: 1.3 },
    { type: 'dialogue', text: 'AI whispers secrets.', prompt: 'I understand now', difficulty: 1.4 },
  ];

  useEffect(() => {
    if (gameState === 'playing' && scenes[currentScene]?.time) {
      const timer = setTimeout(() => endScene(false), scenes[currentScene].time * 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentScene]);

  useEffect(() => {
    if (gameState === 'playing') inputRef.current?.focus();
  }, [gameState]);

  const getAccuracy = (target, input) => {
    const minLen = Math.min(target.length, input.length);
    let correct = 0;
    for (let i = 0; i < minLen; i++) {
      if (target[i].toLowerCase() === input[i].toLowerCase()) correct++;
    }
    return (correct / target.length) * 100;
  };

  const calculateWPM = (input, timeMs) => {
    if (timeMs < 1000) return 0;
    const words = input.trim().split(' ').length;
    const minutes = timeMs / 60000;
    return Math.round(words / minutes);
  };

  const calculateCoinReward = (accuracy, wpm, difficulty, comboCount) => {
    let multiplier = 1;
    if (purchases['u6']) multiplier = 2;
    else if (purchases['u5']) multiplier = 1.5;
    const reward = (Math.floor(accuracy * 2 * difficulty) + Math.floor(wpm / 10) + (comboCount * 5)) * multiplier;
    return Math.max(10, reward);
  };

  const endScene = (success) => {
    const scene = scenes[currentScene];
    const timeElapsed = Date.now() - startTimeRef.current;
    const wpm = calculateWPM(userInput, timeElapsed);

    if (success) {
      const accuracy = getAccuracy(scene.prompt, userInput);
      const coinReward = calculateCoinReward(accuracy, wpm, scene.difficulty, combo);
      setCoins(c => c + coinReward);

      setTypingStats(prev => ({
        ...prev,
        wpm,
        maxWpm: Math.max(prev.maxWpm, wpm),
        totalTyped: prev.totalTyped + userInput.length,
      }));

      if (accuracy === 100) setCombo(combo + 1);
      else setCombo(0);

      setHealth(Math.min(100, health + 15));
    } else {
      setCombo(0);
      setHealth(Math.max(0, health - 20));
    }

    setUserInput('');

    if (currentScene === scenes.length - 1) {
      setLevel(level + 1);
      setGameState('victory');
    } else {
      setCurrentScene(currentScene + 1);
      startTimeRef.current = Date.now();
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setUserInput(value);
    const scene = scenes[currentScene];
    if (scene && scene.type !== 'battle' && value.trim().toLowerCase() === scene.prompt.trim().toLowerCase()) {
      setTimeout(() => endScene(true), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && scenes[currentScene]?.type === 'battle') {
      const accuracy = getAccuracy(scenes[currentScene].prompt, userInput);
      endScene(accuracy > 70);
    }
  };

  const buyItem = (item) => {
    if (coins >= item.cost && !purchases[item.id]) {
      setCoins(coins - item.cost);
      setPurchases({ ...purchases, [item.id]: true });
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentScene(0);
    setHealth(100);
    setCombo(0);
    setScore(0);
    setUserInput('');
    startTimeRef.current = Date.now();
  };

  const getRarityColor = (type) => {
    const colors = { common: 'text-slate-400', rare: 'text-blue-400', epic: 'text-purple-400', legendary: 'text-yellow-400' };
    return colors[type] || colors.common;
  };

  const getRarityBg = (type) => {
    const bgs = { common: 'bg-slate-800', rare: 'bg-blue-900/20', epic: 'bg-purple-900/30', legendary: 'bg-yellow-900/30' };
    return bgs[type] || bgs.common;
  };

  const scene = scenes[currentScene];
  if (!scene) return null;

  const progress = ((currentScene + 1) / scenes.length) * 100;
  const currentTheme = themeMap[selectedTheme] || themeMap.t1;

  if (gameState === 'menu') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentTheme.bg} ${currentTheme.text} p-4`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-8 max-w-3xl">
            <div className="space-y-3">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">⚡ Type Quest</h1>
              <p className="text-2xl opacity-80">Master Speed Typing</p>
              <div className="flex justify-center gap-6 text-sm flex-wrap">
                <div className="bg-slate-800/50 px-4 py-2 rounded-lg">Lvl <span className="font-bold text-yellow-400">{level}</span></div>
                <div className="bg-slate-800/50 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold">{coins}</span>
                </div>
                <div className="bg-slate-800/50 px-4 py-2 rounded-lg">WPM <span className="font-bold text-cyan-400">{typingStats.maxWpm}</span></div>
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => setShowProfile(true)} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-2 font-bold">
                <Trophy className="w-5 h-5" /> Stats
              </button>
              <button onClick={() => setShowShop(true)} className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg flex items-center gap-2 font-bold">
                <ShoppingCart className="w-5 h-5" /> Shop
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {eras.map((e, idx) => (
                <button key={idx} onClick={() => startGame()} className="p-6 rounded-lg border-2 border-purple-500 hover:border-purple-300 hover:bg-purple-900/20">
                  <div className="text-5xl mb-3">{e.symbol}</div>
                  <p className="font-bold text-lg">{e.name}</p>
                </button>
              ))}
            </div>

            {showProfile && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border-2 border-purple-500 rounded-lg max-w-md w-full p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-purple-300">📊 Profile</h2>
                    <button onClick={() => setShowProfile(false)} className="text-2xl">✕</button>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg">
                      <p className="text-sm text-purple-100">Level</p>
                      <p className="text-4xl font-bold">{level}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-purple-300">Max WPM</p>
                        <p className="text-3xl font-bold text-yellow-400">{typingStats.maxWpm}</p>
                      </div>
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-purple-300">Coins</p>
                        <p className="text-3xl font-bold text-yellow-500">{coins}</p>
                      </div>
                      <div className="bg-slate-800 p-4 rounded col-span-2">
                        <p className="text-sm text-purple-300">Characters</p>
                        <p className="text-2xl font-bold text-cyan-400">{typingStats.totalTyped.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showShop && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border-2 border-yellow-500 rounded-lg max-w-6xl w-full max-h-screen overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center p-6 border-b border-yellow-500">
                    <h2 className="text-3xl font-bold text-yellow-300">🛍️ Marketplace</h2>
                    <div className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                      <Coins className="w-6 h-6" /> {coins}
                    </div>
                    <button onClick={() => setShowShop(false)} className="text-2xl">✕</button>
                  </div>

                  <div className="flex gap-2 p-4 border-b border-slate-700 overflow-x-auto">
                    {Object.keys(shopCategories).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setShopTab(tab)}
                        className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${
                          shopTab === tab ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {shopCategories[tab].icon} {shopCategories[tab].label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allItems[shopTab].map(item => (
                        <div key={item.id} className={`${getRarityBg(item.rarity)} border border-slate-700 p-4 rounded-lg hover:border-yellow-500 transition`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className={`text-lg font-bold ${getRarityColor(item.rarity)}`}>{item.name}</p>
                              <p className="text-xs text-slate-400 capitalize">{item.rarity}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">{item.desc}</p>
                          <button
                            onClick={() => {
                              if (!purchases[item.id] && coins >= item.cost) {
                                buyItem(item);
                              }
                              if (purchases[item.id]) {
                                if (shopTab === 'themes') setSelectedTheme(item.id);
                                if (shopTab === 'fonts') setSelectedFont(item.id);
                                if (shopTab === 'pets') setSelectedPet(item.id);
                              }
                            }}
                            className={`w-full py-2 rounded font-bold transition text-sm ${
                              purchases[item.id]
                                ? 'bg-green-600 hover:bg-green-500 text-white cursor-pointer'
                                : coins >= item.cost
                                ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                                : 'bg-slate-600 text-slate-400'
                            }`}
                          >
                            {purchases[item.id] ? '✓ Select' : `${item.cost} 🪙`}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentTheme.bg} ${currentTheme.text} p-8`}>
        <button onClick={() => setGameState('menu')} className="flex items-center gap-2 mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
          <ArrowLeft className="w-4 h-4" /> Menu
        </button>

        <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-500">
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-lg font-bold">{Math.round(health + (purchases['u1'] ? 25 : 0))}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-lg font-bold">{combo}x</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-bold">{coins}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-bold">Lvl {level}</span>
            </div>
          </div>
          {selectedPet && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-6xl animate-bounce drop-shadow-lg filter brightness-150">
                {selectedPet === 'p1' ? '🐉' : selectedPet === 'p2' ? '🔥' : selectedPet === 'p3' ? '🦄' : selectedPet === 'p4' ? '⚫' : ''}
              </div>
              <div className="text-sm font-bold text-yellow-300 bg-slate-800/80 px-3 py-1 rounded-full">
                {selectedPet === 'p1' ? 'Dragon' : selectedPet === 'p2' ? 'Phoenix' : selectedPet === 'p3' ? 'Unicorn' : selectedPet === 'p4' ? 'Shadow' : ''}
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        <div className="w-full bg-slate-700 rounded-full h-2 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold opacity-90">{scene.text}</h2>

          {scene.type === 'battle' && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
              <p className="font-bold text-red-300">⚔️ Battle Mode!</p>
              <p className="text-sm text-red-200">70%+ accuracy to win</p>
            </div>
          )}

          <div className="bg-slate-800/50 border border-purple-500 rounded-lg p-6 space-y-4">
            <p className="text-purple-300 text-sm">Type this:</p>
            <p className="text-2xl font-bold text-purple-100 tracking-wider" style={fontMap[selectedFont]}>{scene.prompt}</p>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
              placeholder="Start typing..."
              className="w-full bg-slate-700 text-white px-4 py-3 rounded border border-purple-400 focus:outline-none focus:border-purple-300"
              autoComplete="off"
              style={fontMap[selectedFont]}
            />
          </div>

          {scene.type === 'battle' && (
            <button
              onClick={() => {
                const accuracy = getAccuracy(scene.prompt, userInput);
                endScene(accuracy > 70);
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-lg transition"
            >
              Attack!
            </button>
          )}

          {userInput.length > 0 && (
            <div className="text-center text-purple-300 text-sm">
              {scene.type === 'battle' ? `Accuracy: ${Math.round(getAccuracy(scene.prompt, userInput))}%` : `${userInput.length}/${scene.prompt.length}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentTheme.bg} ${currentTheme.text} flex items-center justify-center p-4`}>
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-5xl font-bold text-yellow-400">Victory!</h1>
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="opacity-75">Final Score</p>
            <p className="text-3xl font-bold text-cyan-400">{score}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="opacity-75">Coins Earned</p>
            <p className="text-3xl font-bold text-yellow-400">{coins}</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => setGameState('menu')} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold">Menu</button>
          <button onClick={() => startGame()} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold">Play Again</button>
        </div>
      </div>
    </div>
  );
};

export default TypingGame;