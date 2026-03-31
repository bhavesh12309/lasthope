import { useState, useEffect } from 'react';
import { User, Save, ArrowLeft, Smile, Sparkles, Camera, Palette, Layers, Shuffle, ArrowUp, ArrowDown, Award, Lock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AVATAR_STYLES = [
  { id: 'avatar1', emoji: '👤', label: 'Default' },
  { id: 'avatar2', emoji: '😊', label: 'Happy' },
  { id: 'avatar3', emoji: '😎', label: 'Cool' },
  { id: 'avatar4', emoji: '🚀', label: 'Rocket' },
  { id: 'avatar5', emoji: '🎨', label: 'Artist' },
  { id: 'avatar6', emoji: '🎮', label: 'Gamer' },
  { id: 'avatar7', emoji: '📚', label: 'Scholar' },
  { id: 'avatar8', emoji: '🌟', label: 'Star' },
];

const EXPRESSIONS = [
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated' },
  { id: 'focused', emoji: '🧐', label: 'Focused' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'angry', emoji: '😠', label: 'Angry' },
  { id: 'cool', emoji: '😎', label: 'Cool' },
];

const AVAILABLE_ACCESSORIES = [
  { id: 'hat1', emoji: '🎩', label: 'Top Hat', category: 'hat' },
  { id: 'hat2', emoji: '🧢', label: 'Cap', category: 'hat' },
  { id: 'hat3', emoji: '👑', label: 'Crown', category: 'hat' },
  { id: 'hat4', emoji: '🎓', label: 'Graduation', category: 'hat' },
  { id: 'hat5', emoji: '⛑️', label: 'Helmet', category: 'hat' },
  { id: 'glasses1', emoji: '👓', label: 'Glasses', category: 'glasses' },
  { id: 'glasses2', emoji: '🕶️', label: 'Sunglasses', category: 'glasses' },
  { id: 'glasses3', emoji: '🥽', label: 'Goggles', category: 'glasses' },
  { id: 'badge1', emoji: '⭐', label: 'Star', category: 'badge' },
  { id: 'badge2', emoji: '🏆', label: 'Trophy', category: 'badge' },
  { id: 'badge3', emoji: '🎖️', label: 'Medal', category: 'badge' },
  { id: 'badge4', emoji: '💎', label: 'Diamond', category: 'badge' },
];

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
  '#ffc0cb', '#a52a2a', '#808080', '#ffdbac', '#8b4513',
];

const ACHIEVEMENTS = [
  { id: 'none', name: 'Default', description: 'Basic profile frame', frame: 'none', requirement: 'Available by default', unlocked: true, icon: '⚪' },
  { id: 'bronze', name: 'Bronze Badge', description: 'Type 500 characters', frame: 'bronze', requirement: '500 characters', unlocked: true, icon: '🥉' },
  { id: 'silver', name: 'Silver Star', description: 'Type 2000 characters', frame: 'silver', requirement: '2000 characters', unlocked: true, icon: '🥈' },
  { id: 'gold', name: 'Gold Champion', description: 'Type 5000 characters', frame: 'gold', requirement: '5000 characters', unlocked: false, icon: '🥇' },
  { id: 'diamond', name: 'Diamond Legend', description: 'Achieve 95% accuracy with 20+ streak', frame: 'diamond', requirement: '95% accuracy + 20 streak', unlocked: false, icon: '💎' },
  { id: 'rainbow', name: 'Rainbow Master', description: 'Complete all seasonal themes', frame: 'rainbow', requirement: 'All seasonal themes', unlocked: false, icon: '🌈' },
];

const PET_LEVELS = [
  { level: 0, name: 'Egg', emoji: '🥚', minChars: 0 },
  { level: 1, name: 'Baby', emoji: '🐣', minChars: 100 },
  { level: 2, name: 'Kid', emoji: '🐥', minChars: 500 },
  { level: 3, name: 'Teen', emoji: '🦆', minChars: 1500 },
  { level: 4, name: 'Adult', emoji: '🦅', minChars: 3000 },
  { level: 5, name: 'Pro', emoji: '👑', minChars: 5000 },
];

const MOODS = {
  frustrated: { emoji: '😤', label: 'Frustrated', color: '#ef4444' },
  neutral: { emoji: '😐', label: 'Neutral', color: '#6b7280' },
  focused: { emoji: '😊', label: 'Focused', color: '#3b82f6' },
  happy: { emoji: '😁', label: 'Happy', color: '#10b981' },
  excited: { emoji: '🤩', label: 'On Fire!', color: '#f59e0b' },
};

const ALL_SEASONAL_THEMES = [
  { id: 'halloween', name: 'Halloween', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', accessory: '🎃', emoji: '👻' },
  { id: 'christmas', name: 'Christmas', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', accessory: '🎅', emoji: '🎄' },
  { id: 'newyear', name: 'New Year', background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', accessory: '🎉', emoji: '🎊' },
  { id: 'valentine', name: 'Valentine', background: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)', accessory: '💝', emoji: '💕' },
  { id: 'spring', name: 'Spring', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', accessory: '🌸', emoji: '🦋' },
  { id: 'summer', name: 'Summer', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accessory: '🏖️', emoji: '☀️' },
];

const FRAMES = {
  none: { border: '4px solid white', shadow: 'shadow-lg', gradient: false },
  bronze: { border: '4px solid #cd7f32', shadow: 'shadow-xl shadow-orange-300', gradient: false },
  silver: { border: '4px solid #c0c0c0', shadow: 'shadow-xl shadow-gray-300', gradient: false },
  gold: { border: '4px solid #ffd700', shadow: 'shadow-xl shadow-yellow-300', gradient: false },
  diamond: { border: '4px solid #b9f2ff', shadow: 'shadow-xl shadow-cyan-300', gradient: false },
  rainbow: { border: '4px solid transparent', shadow: 'shadow-xl shadow-purple-300', gradient: true },
};

function calculatePetLevel(totalCharacters) {
  for (let i = PET_LEVELS.length - 1; i >= 0; i--) {
    if (totalCharacters >= PET_LEVELS[i].minChars) {
      return PET_LEVELS[i].level;
    }
  }
  return 0;
}

function calculateMood(accuracyRate, streak) {
  if (accuracyRate < 70) return 'frustrated';
  if (accuracyRate < 85) return 'neutral';
  if (streak >= 10) return 'excited';
  if (accuracyRate >= 95) return 'happy';
  return 'focused';
}

function getCurrentSeasonalTheme() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (month === 10 || (month === 11 && day <= 2)) return ALL_SEASONAL_THEMES[0];
  if (month === 12 && day <= 31) return ALL_SEASONAL_THEMES[1];
  if (month === 1 && day === 1) return ALL_SEASONAL_THEMES[2];
  if (month === 2 && day === 14) return ALL_SEASONAL_THEMES[3];
  if ((month === 3 && day >= 15) || (month === 4 && day <= 15)) return ALL_SEASONAL_THEMES[4];
  if (month >= 6 && month <= 8) return ALL_SEASONAL_THEMES[5];

  return null;
}
const AvatarBuilder = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 flex flex-col items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold mb-4">Avatar Builder</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Here you can customize your typing avatar! (Feature coming soon 🚧)
      </p>
    </div>
  );
};
export default function UserProfile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: 'User123',
    bio: 'Welcome to my profile!',
    avatar: '👤',
    expression: 'neutral',
    themeColor: '#3b82f6',
    customColors: { hair: '#000000', skin: '#ffdbac', background: '#ffffff' },
    accessories: [],
    seasonalTheme: 'none',
    frame: 'none',
  });

  const [typingStats, setTypingStats] = useState({
    totalCharacters: 1234,
    accuracyRate: 92.5,
    currentStreak: 7,
    bestStreak: 15,
  });

  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [testText, setTestText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    const currentTheme = getCurrentSeasonalTheme();
    if (currentTheme) {
      setProfile(prev => ({ ...prev, seasonalTheme: currentTheme.id }));
      setTempProfile(prev => ({ ...prev, seasonalTheme: currentTheme.id }));
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const tempUserId = 'demo-user-' + Math.random().toString(36).substr(2, 9);
      setUserId(tempUserId);

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', tempUserId)
        .maybeSingle();

      if (profileData) {
        setProfile({
          username: profileData.username,
          bio: profileData.bio || '',
          avatar: profileData.avatar_base,
          expression: profileData.avatar_expression,
          themeColor: profileData.theme_color,
          customColors: profileData.custom_colors,
          accessories: profileData.accessories || [],
          seasonalTheme: profileData.seasonal_theme,
          frame: profileData.avatar_frame,
        });
        setTempProfile({
          username: profileData.username,
          bio: profileData.bio || '',
          avatar: profileData.avatar_base,
          expression: profileData.avatar_expression,
          themeColor: profileData.theme_color,
          customColors: profileData.custom_colors,
          accessories: profileData.accessories || [],
          seasonalTheme: profileData.seasonal_theme,
          frame: profileData.avatar_frame,
        });
      }

      const { data: statsData } = await supabase
        .from('typing_stats')
        .select('*')
        .eq('user_id', tempUserId)
        .maybeSingle();

      if (statsData) {
        setTypingStats({
          totalCharacters: statsData.total_characters,
          accuracyRate: statsData.accuracy_rate,
          currentStreak: statsData.current_streak,
          bestStreak: statsData.best_streak,
        });
      }

      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', tempUserId);

      if (achievementsData && achievementsData.length > 0) {
        const unlockedFrames = achievementsData.map(a => a.frame_unlocked);
        const updatedAchievements = ACHIEVEMENTS.map(ach => ({
          ...ach,
          unlocked: ach.unlocked || unlockedFrames.includes(ach.frame)
        }));
        setAchievements(updatedAchievements);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const mood = calculateMood(typingStats.accuracyRate, typingStats.currentStreak);
    setProfile(prev => ({ ...prev, expression: mood }));
    setTempProfile(prev => ({ ...prev, expression: mood }));
  }, [typingStats]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (typingStats.currentStreak >= 5) {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 1000);
    }
  }, [typingStats.currentStreak]);

  const handleSave = async () => {
    if (!userId) return;

    try {
      await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          username: tempProfile.username,
          bio: tempProfile.bio,
          avatar_base: tempProfile.avatar,
          avatar_expression: tempProfile.expression,
          theme_color: tempProfile.themeColor,
          custom_colors: tempProfile.customColors,
          accessories: tempProfile.accessories,
          seasonal_theme: tempProfile.seasonalTheme,
          avatar_frame: tempProfile.frame,
          updated_at: new Date().toISOString(),
        });

      setProfile(tempProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleTypingTest = async (text) => {
    setTestText(text);
    const newCharCount = typingStats.totalCharacters + text.length;
    const newAccuracy = Math.max(70, Math.min(100, 90 + Math.random() * 10));
    const newStreak = text.length > 0 ? typingStats.currentStreak + 1 : 0;

    const newStats = {
      totalCharacters: newCharCount,
      accuracyRate: newAccuracy,
      currentStreak: newStreak,
      bestStreak: Math.max(typingStats.bestStreak, newStreak),
    };

    setTypingStats(newStats);

    if (userId) {
      try {
        await supabase
          .from('typing_stats')
          .upsert({
            user_id: userId,
            total_characters: newCharCount,
            accuracy_rate: newAccuracy,
            current_streak: newStreak,
            best_streak: newStats.bestStreak,
            mood: calculateMood(newAccuracy, newStreak),
            pet_level: calculatePetLevel(newCharCount),
            last_activity: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        checkAndUnlockAchievements(newStats);
      } catch (error) {
        console.error('Error updating typing stats:', error);
      }
    }
  };

  const checkAndUnlockAchievements = async (stats) => {
    if (!userId) return;

    const newlyUnlocked = [];

    if (stats.totalCharacters >= 500 && !achievements.find(a => a.id === 'bronze')?.unlocked) {
      newlyUnlocked.push(achievements.find(a => a.id === 'bronze'));
    }
    if (stats.totalCharacters >= 2000 && !achievements.find(a => a.id === 'silver')?.unlocked) {
      newlyUnlocked.push(achievements.find(a => a.id === 'silver'));
    }
    if (stats.totalCharacters >= 5000 && !achievements.find(a => a.id === 'gold')?.unlocked) {
      newlyUnlocked.push(achievements.find(a => a.id === 'gold'));
    }
    if (stats.accuracyRate >= 95 && stats.currentStreak >= 20 && !achievements.find(a => a.id === 'diamond')?.unlocked) {
      newlyUnlocked.push(achievements.find(a => a.id === 'diamond'));
    }

    if (newlyUnlocked.length > 0) {
      try {
        for (const achievement of newlyUnlocked) {
          await supabase
            .from('achievements')
            .insert({
              user_id: userId,
              achievement_type: 'frame',
              achievement_name: achievement.name,
              frame_unlocked: achievement.frame,
              unlocked_at: new Date().toISOString(),
            });
        }

        const updatedAchievements = achievements.map(ach => {
          const unlocked = newlyUnlocked.find(nu => nu.id === ach.id);
          return unlocked ? { ...ach, unlocked: true } : ach;
        });
        setAchievements(updatedAchievements);
      } catch (error) {
        console.error('Error unlocking achievements:', error);
      }
    }
  };

  const toggleAccessory = (accessory) => {
    const exists = tempProfile.accessories.find(a => a.id === accessory.id);
    if (exists) {
      setTempProfile({ ...tempProfile, accessories: tempProfile.accessories.filter(a => a.id !== accessory.id) });
    } else {
      const newAccessory = { ...accessory, zIndex: tempProfile.accessories.length + 1 };
      setTempProfile({ ...tempProfile, accessories: [...tempProfile.accessories, newAccessory] });
    }
  };

  const moveLayer = (accessoryId, direction) => {
    const index = tempProfile.accessories.findIndex(a => a.id === accessoryId);
    if (index === -1) return;

    const newAccessories = [...tempProfile.accessories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newAccessories.length) return;

    [newAccessories[index], newAccessories[targetIndex]] = [newAccessories[targetIndex], newAccessories[index]];
    newAccessories.forEach((acc, idx) => { acc.zIndex = idx + 1; });

    setTempProfile({ ...tempProfile, accessories: newAccessories });
  };

  const randomizeAccessories = () => {
    const count = Math.floor(Math.random() * 4) + 1;
    const shuffled = [...AVAILABLE_ACCESSORIES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count).map((acc, idx) => ({ ...acc, zIndex: idx + 1 }));
    setTempProfile({ ...tempProfile, accessories: selected });
  };

  const filteredAccessories = selectedCategory === 'all'
    ? AVAILABLE_ACCESSORIES
    : AVAILABLE_ACCESSORIES.filter(a => a.category === selectedCategory);

  const currentSeasonalTheme = getCurrentSeasonalTheme();
  const selectedSeasonalTheme = ALL_SEASONAL_THEMES.find(t => t.id === profile.seasonalTheme);
  const backgroundStyle = selectedSeasonalTheme ? { background: selectedSeasonalTheme.background } : {};

  const showSparkles = typingStats.currentStreak >= 5;
  const currentMood = MOODS[profile.expression] || MOODS.neutral;
  const currentLevel = calculatePetLevel(typingStats.totalCharacters);
  const currentPet = PET_LEVELS[currentLevel];
  const nextPet = PET_LEVELS[currentLevel + 1];
  const progress = nextPet ? ((typingStats.totalCharacters - currentPet.minChars) / (nextPet.minChars - currentPet.minChars)) * 100 : 100;

  const frameStyle = FRAMES[profile.frame] || FRAMES.none;
  const expressionEmoji = EXPRESSIONS.find(e => e.id === profile.expression)?.emoji || profile.avatar;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={backgroundStyle}>
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div
                className="h-32 relative"
                style={{
                  backgroundColor: profile.themeColor,
                  background: selectedSeasonalTheme ? selectedSeasonalTheme.background : profile.themeColor
                }}
              >
                {selectedSeasonalTheme && (
                  <div className="absolute top-4 right-4 text-4xl">{selectedSeasonalTheme.emoji}</div>
                )}
                <div className="absolute -bottom-16 left-8">
                  <div className="relative inline-block">
                    {showSparkles && (
                      <div className="absolute -top-2 -right-2 z-20 animate-pulse">
                        <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                    <div
                      className={`w-32 h-32 rounded-full flex items-center justify-center relative ${frameStyle.shadow} ${isBouncing ? 'animate-bounce' : ''} ${isBlinking ? 'opacity-80' : 'opacity-100'} transition-all duration-200`}
                      style={{
                        border: frameStyle.gradient ? 'none' : frameStyle.border,
                        background: frameStyle.gradient ? 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)' : '#f3f4f6',
                        backgroundSize: frameStyle.gradient ? '300% 300%' : 'auto',
                        animation: frameStyle.gradient ? 'gradient 3s ease infinite' : 'none',
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-6xl ${isBlinking ? 'scale-95' : 'scale-100'}`}>{expressionEmoji}</span>
                      </div>
                      {profile.accessories.sort((a, b) => a.zIndex - b.zIndex).map((accessory) => (
                        <div
                          key={accessory.id}
                          className="absolute text-3xl"
                          style={{
                            zIndex: accessory.zIndex + 10,
                            top: accessory.category === 'hat' ? '-10%' : '50%',
                            left: accessory.category === 'badge' ? '-10%' : '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {accessory.emoji}
                        </div>
                      ))}
                    </div>
                    <style>{`@keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>
                  </div>
                </div>
              </div>

              <div className="pt-20 px-8 pb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h1>
                    <p className="text-gray-600 mb-3">{profile.bio}</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                        style={{ backgroundColor: currentMood.color + '20', color: currentMood.color }}
                      >
                        <span className="text-lg">{currentMood.emoji}</span>
                        {currentMood.label}
                      </div>
                      {currentSeasonalTheme && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          <span className="text-lg">{currentSeasonalTheme.emoji}</span>
                          {currentSeasonalTheme.name}
                        </div>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing && (
                  <div className="space-y-6 mt-8 border-t pt-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={tempProfile.username}
                        onChange={(e) => setTempProfile({ ...tempProfile, username: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={tempProfile.bio}
                        onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows={3}
                        placeholder="Tell us about yourself"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Camera className="w-4 h-4" />
                        Choose Base Avatar
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                        {AVATAR_STYLES.map((avatar) => (
                          <button
                            key={avatar.id}
                            onClick={() => setTempProfile({ ...tempProfile, avatar: avatar.emoji })}
                            className={`p-4 rounded-xl text-4xl transition-all hover:scale-110 ${tempProfile.avatar === avatar.emoji ? 'bg-blue-100 ring-2 ring-blue-500 scale-110' : 'bg-gray-100 hover:bg-gray-200'}`}
                            title={avatar.label}
                          >
                            {avatar.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Smile className="w-4 h-4" />
                        Expression & Mood
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                        {EXPRESSIONS.map((expr) => (
                          <button
                            key={expr.id}
                            onClick={() => setTempProfile({ ...tempProfile, expression: expr.id })}
                            className={`p-4 rounded-xl text-4xl transition-all hover:scale-110 ${tempProfile.expression === expr.id ? 'bg-blue-100 ring-2 ring-blue-500 scale-110' : 'bg-gray-100 hover:bg-gray-200'}`}
                            title={expr.label}
                          >
                            {expr.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <Layers className="w-4 h-4" />
                          Accessories & Layers
                        </label>
                        <button
                          onClick={randomizeAccessories}
                          className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-semibold"
                        >
                          <Shuffle className="w-4 h-4" />
                          Randomize
                        </button>
                      </div>

                      <div className="flex gap-2 mb-3">
                        {['all', 'hat', 'glasses', 'badge'].map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {filteredAccessories.map((accessory) => {
                          const isSelected = tempProfile.accessories.some(a => a.id === accessory.id);
                          return (
                            <button
                              key={accessory.id}
                              onClick={() => toggleAccessory(accessory)}
                              className={`p-4 rounded-xl text-3xl transition-all hover:scale-110 ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500 scale-110' : 'bg-gray-100 hover:bg-gray-200'}`}
                              title={accessory.label}
                            >
                              {accessory.emoji}
                            </button>
                          );
                        })}
                      </div>

                      {tempProfile.accessories.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Layer Order (Top to Bottom)</h4>
                          <div className="space-y-2">
                            {[...tempProfile.accessories].reverse().map((accessory, index) => {
                              const actualIndex = tempProfile.accessories.length - 1 - index;
                              return (
                                <div key={accessory.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{accessory.emoji}</span>
                                    <span className="text-sm font-medium text-gray-700">{accessory.label}</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => moveLayer(accessory.id, 'up')}
                                      disabled={actualIndex === tempProfile.accessories.length - 1}
                                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Move up"
                                    >
                                      <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => moveLayer(accessory.id, 'down')}
                                      disabled={actualIndex === 0}
                                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Move down"
                                    >
                                      <ArrowDown className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Palette className="w-4 h-4" />
                        Theme Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={tempProfile.themeColor} onChange={(e) => setTempProfile({ ...tempProfile, themeColor: e.target.value })} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300" />
                        <div className="flex-1">
                          <input type="text" value={tempProfile.themeColor} onChange={(e) => setTempProfile({ ...tempProfile, themeColor: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" placeholder="#000000" />
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            {PRESET_COLORS.map((presetColor) => (
                              <button
                                key={presetColor}
                                onClick={() => setTempProfile({ ...tempProfile, themeColor: presetColor })}
                                className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${tempProfile.themeColor.toLowerCase() === presetColor.toLowerCase() ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
                                style={{ backgroundColor: presetColor }}
                                title={presetColor}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Palette className="w-4 h-4" />
                        Hair Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={tempProfile.customColors.hair} onChange={(e) => setTempProfile({ ...tempProfile, customColors: { ...tempProfile.customColors, hair: e.target.value }})} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300" />
                        <input type="text" value={tempProfile.customColors.hair} onChange={(e) => setTempProfile({ ...tempProfile, customColors: { ...tempProfile.customColors, hair: e.target.value }})} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Palette className="w-4 h-4" />
                        Skin Tone
                      </label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={tempProfile.customColors.skin} onChange={(e) => setTempProfile({ ...tempProfile, customColors: { ...tempProfile.customColors, skin: e.target.value }})} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300" />
                        <input type="text" value={tempProfile.customColors.skin} onChange={(e) => setTempProfile({ ...tempProfile, customColors: { ...tempProfile.customColors, skin: e.target.value }})} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Award className="w-4 h-4" />
                        Achievement Frames
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {achievements.map((achievement) => (
                          <button
                            key={achievement.id}
                            onClick={() => achievement.unlocked && setTempProfile({ ...tempProfile, frame: achievement.frame })}
                            disabled={!achievement.unlocked}
                            className={`p-4 rounded-xl border-2 transition-all ${achievement.unlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'} ${tempProfile.frame === achievement.frame ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 bg-white'}`}
                          >
                            <div className="text-4xl mb-2">{achievement.icon}</div>
                            <div className="text-sm font-semibold text-gray-900 mb-1">{achievement.name}</div>
                            <div className="text-xs text-gray-600 mb-2">{achievement.description}</div>
                            <div className="flex items-center justify-center gap-1 text-xs">
                              {achievement.unlocked ? (
                                <span className="text-green-600 font-semibold">Unlocked</span>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-500">{achievement.requirement}</span>
                                </>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Sparkles className="w-4 h-4" />
                        Seasonal Themes
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ALL_SEASONAL_THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setTempProfile({ ...tempProfile, seasonalTheme: theme.id })}
                            className={`p-4 rounded-xl transition-all hover:scale-105 ${tempProfile.seasonalTheme === theme.id ? 'ring-2 ring-blue-500 scale-105' : ''}`}
                            style={{ background: theme.background }}
                          >
                            <div className="text-3xl mb-2">{theme.emoji}</div>
                            <div className="text-sm font-semibold text-white drop-shadow-lg">{theme.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        <Save className="w-5 h-5" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="mt-8 grid grid-cols-3 gap-6 text-center border-t pt-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{typingStats.totalCharacters.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Characters</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{typingStats.accuracyRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{typingStats.currentStreak}</div>
                      <div className="text-sm text-gray-600">Streak</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Try Typing to See Your Mood Change!</h3>
                <textarea
                  value={testText}
                  onChange={(e) => handleTypingTest(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                  placeholder="Start typing here to see your avatar react to your typing stats..."
                />
                <p className="text-sm text-gray-600 mt-2">Your avatar's mood changes based on accuracy and streak! Keep typing to evolve your pet!</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Mini-Pet Evolution
                </h3>
                {typingStats.currentStreak >= 5 && (
                  <div className="flex items-center gap-1 text-amber-600 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">{typingStats.currentStreak} Streak!</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 mb-4">
                <div className="text-6xl transition-all duration-500">{currentPet.emoji}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Level {currentLevel}: {currentPet.name}</span>
                    {nextPet && (
                      <span className="text-xs text-gray-500">Next: {nextPet.name} {nextPet.emoji}</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-600">{typingStats.totalCharacters.toLocaleString()} chars</span>
                    {nextPet && <span className="text-xs text-gray-600">{nextPet.minChars.toLocaleString()} needed</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {PET_LEVELS.map((pet) => (
                  <div
                    key={pet.level}
                    className={`text-center p-2 rounded-lg transition-all ${pet.level === currentLevel ? 'bg-blue-200 scale-110 shadow-md' : pet.level < currentLevel ? 'bg-green-100' : 'bg-gray-100 opacity-50'}`}
                  >
                    <div className="text-2xl">{pet.emoji}</div>
                    <div className="text-xs font-semibold text-gray-700 mt-1">{pet.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}