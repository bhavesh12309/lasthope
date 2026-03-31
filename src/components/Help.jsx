import { useState, useMemo, useEffect } from 'react';
import {
  Search, Book, Keyboard, Target, Trophy, Settings,
  ChevronDown, ChevronRight, Play,
  BarChart3, Users, Award, Clock, Zap, MessageCircle,
  BookOpen, Home, ArrowUp, ExternalLink, Moon, Sun
} from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.sessionStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.sessionStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Play className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      articles: [
        {
          title: 'How to Start Your First Lesson',
          content: 'Navigate to the Practice page and select a lesson that matches your skill level. Click "Start Typing" to begin. The interface will guide you through proper finger placement and technique.',
          tags: ['beginner', 'practice', 'lesson']
        },
        {
          title: 'Understanding Your Stats',
          content: 'WPM (Words Per Minute) measures your typing speed. Accuracy shows the percentage of correctly typed characters. These metrics update in real-time as you practice.',
          tags: ['stats', 'wpm', 'accuracy']
        },
        {
          title: 'Choosing the Right Difficulty',
          content: 'Start with Beginner lessons if you\'re new to typing. Progress to Intermediate and Advanced as you improve. Each level introduces new challenges and techniques.',
          tags: ['difficulty', 'beginner', 'progress']
        },
        {
          title: 'Creating Your Account',
          content: 'Sign up to track your progress, earn achievements, and compete on leaderboards. Your data syncs across devices automatically.',
          tags: ['account', 'signup', 'sync']
        },
      ],
    },
    {
      id: 'typing-practice',
      title: 'Typing Practice',
      icon: <Keyboard className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      articles: [
        {
          title: 'Proper Typing Posture',
          content: 'Sit up straight with your back supported. Keep your feet flat on the floor. Position your hands over the home row keys (ASDF for left hand, JKL; for right hand). Your wrists should be slightly elevated.',
          tags: ['posture', 'ergonomics', 'technique']
        },
        {
          title: 'Home Row Technique',
          content: 'Place your fingers on ASDF (left hand) and JKL; (right hand). Your index fingers should rest on F and J (which have small bumps). This is your starting position for all typing.',
          tags: ['home row', 'finger placement', 'basics']
        },
        {
          title: 'Touch Typing Tips',
          content: 'Look at the screen, not your keyboard. Use the correct finger for each key. Practice regularly for best results. Build muscle memory through repetition.',
          tags: ['touch typing', 'tips', 'muscle memory']
        },
        {
          title: 'Dealing with Mistakes',
          content: 'Don\'t worry about mistakes during practice. Focus on accuracy first, then gradually increase speed. Use the backspace key sparingly - sometimes it\'s better to complete the word and learn from the error.',
          tags: ['mistakes', 'errors', 'improvement']
        },
        {
          title: 'Speed Building Exercises',
          content: 'Start slow and focus on accuracy. Gradually increase your speed as muscle memory develops. Practice common word patterns and digraphs (th, ch, sh, etc.).',
          tags: ['speed', 'exercises', 'drills']
        },
      ],
    },
    {
      id: 'lessons-themes',
      title: 'Lessons & Themes',
      icon: <Book className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      articles: [
        {
          title: 'Lesson Categories',
          content: 'Choose from Basics, Programming, Literature, Business, Gaming, and Quotes categories based on your interests. Each category offers unique vocabulary and challenges.',
          tags: ['categories', 'lessons', 'variety']
        },
        {
          title: 'Theme Selection',
          content: 'Select from Cyberpunk, Retro, Calming, or Kids themes to customize your typing environment. Themes affect colors, fonts, and visual effects to match your preference.',
          tags: ['themes', 'customization', 'visual']
        },
        {
          title: 'Custom Text Practice',
          content: 'You can practice with your own text by creating custom lessons in the Practice section. Perfect for practicing specific content or preparing for typing tests.',
          tags: ['custom', 'text', 'personalization']
        },
        {
          title: 'Difficulty Progression',
          content: 'Lessons automatically adjust difficulty based on your performance. Master one level to unlock the next. Track your progress through each category.',
          tags: ['difficulty', 'progression', 'unlocks']
        },
      ],
    },
    {
      id: 'progress-tracking',
      title: 'Progress & Analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      articles: [
        {
          title: 'Understanding Your Dashboard',
          content: 'Your dashboard shows your progress over time, including WPM improvements, accuracy trends, and practice streaks. Review charts and graphs to visualize your growth.',
          tags: ['dashboard', 'stats', 'visualization']
        },
        {
          title: 'Setting Goals',
          content: 'Set daily practice goals and track your progress. Consistent practice is key to improvement. Receive notifications when you meet your goals.',
          tags: ['goals', 'targets', 'motivation']
        },
        {
          title: 'Analyzing Your Performance',
          content: 'Review your session history to identify patterns and areas for improvement. See which keys you struggle with most and focus your practice accordingly.',
          tags: ['analysis', 'performance', 'improvement']
        },
        {
          title: 'Exporting Your Data',
          content: 'Export your typing history and statistics in CSV or JSON format for personal analysis or sharing with instructors.',
          tags: ['export', 'data', 'backup']
        },
      ],
    },
    {
      id: 'achievements',
      title: 'Achievements & Levels',
      icon: <Trophy className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      articles: [
        {
          title: 'How Achievements Work',
          content: 'Earn achievements by reaching speed milestones, maintaining accuracy, and completing challenges. Each achievement unlocks badges and rewards.',
          tags: ['achievements', 'badges', 'rewards']
        },
        {
          title: 'Leveling Up',
          content: 'Gain XP by practicing regularly. Higher levels unlock new features, themes, and recognition. Check the level requirements in your profile.',
          tags: ['levels', 'xp', 'progression']
        },
        {
          title: 'Leaderboards',
          content: 'Compete with other typists globally and see where you rank in speed and accuracy. Filter by daily, weekly, monthly, or all-time rankings.',
          tags: ['leaderboard', 'competition', 'ranking']
        },
        {
          title: 'Challenge Mode',
          content: 'Participate in timed challenges and special events. Earn bonus XP and exclusive badges for completing limited-time challenges.',
          tags: ['challenges', 'events', 'special']
        },
      ],
    },
    {
      id: 'settings',
      title: 'Settings & Customization',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-gray-600 to-slate-700',
      articles: [
        {
          title: 'Customizing Your Experience',
          content: 'Adjust font size, enable/disable sounds, and customize your practice preferences in Settings. Configure keyboard layout, timer display, and more.',
          tags: ['settings', 'customization', 'preferences']
        },
        {
          title: 'Dark Mode',
          content: 'Toggle between light and dark themes using the theme button in the navigation bar. Dark mode reduces eye strain during extended practice sessions.',
          tags: ['dark mode', 'theme', 'appearance']
        },
        {
          title: 'Keyboard Shortcuts',
          content: 'Use Ctrl+R to restart a lesson, Space to pause/resume, and Esc to return to lesson selection. View all shortcuts in Settings > Keyboard Shortcuts.',
          tags: ['shortcuts', 'keyboard', 'hotkeys']
        },
        {
          title: 'Audio Settings',
          content: 'Customize typing sounds, error notifications, and achievement alerts. Choose from multiple sound packs or disable audio completely.',
          tags: ['audio', 'sounds', 'notifications']
        },
        {
          title: 'Privacy & Data',
          content: 'Control what data is shared and stored. Export or delete your account data at any time. Review our privacy policy for details.',
          tags: ['privacy', 'data', 'security']
        },
      ],
    },
  ];

  const quickTips = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: 'Focus on Accuracy First',
      description: 'Speed will naturally improve as you build muscle memory and proper technique',
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: 'Practice Regularly',
      description: '15-30 minutes daily is more effective than long, infrequent practice sessions',
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      title: 'Use All Fingers',
      description: 'Don\'t rely on just a few fingers - proper finger placement is essential',
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" />,
      title: 'Set Realistic Goals',
      description: 'Aim for gradual, consistent improvement rather than dramatic jumps',
    },
  ];

  const popularArticles = [
    { section: 'getting-started', index: 0 },
    { section: 'typing-practice', index: 1 },
    { section: 'typing-practice', index: 0 },
    { section: 'progress-tracking', index: 0 },
  ];

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return helpSections;

    const term = searchTerm.toLowerCase();
    return helpSections
      .map(section => ({
        ...section,
        articles: section.articles.filter(article =>
          article.title.toLowerCase().includes(term) ||
          article.content.toLowerCase().includes(term) ||
          article.tags?.some(tag => tag.toLowerCase().includes(term))
        )
      }))
      .filter(section => section.articles.length > 0);
  }, [searchTerm]);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
    setActiveArticle(null);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 border-gray-200 dark:border-gray-700"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Base</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">Help Center</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Everything you need to master your typing skills with TypeMaster.
            Find answers, tips, and guidance to accelerate your learning journey.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 transition-colors group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Search help articles, tips, tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Found {filteredSections.reduce((acc, section) => acc + section.articles.length, 0)} result(s)
            </div>
          )}
        </div>
      </section>

      {/* Popular Articles */}
      {!searchTerm && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-2 mb-8">
              <Award className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Most Popular Articles
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {popularArticles.map((ref, idx) => {
                const section = helpSections.find(s => s.id === ref.section);
                const article = section?.articles[ref.index];
                if (!section || !article) return null;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setExpandedSection(section.id);
                      setActiveArticle({ section: section.id, index: ref.index });
                      setTimeout(() => {
                        document.getElementById(`article-${section.id}-${ref.index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 text-left hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`p-2 ${section.color} rounded-lg text-white`}>
                            {section.icon}
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {section.title}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {article.content}
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Quick Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Quick Tips for Success
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-center mb-4">
                  {tip.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Browse by Topic
          </h2>

          <div className="space-y-4">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 ${section.color} rounded-xl text-white shadow-lg`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {highlightText(section.title, searchTerm)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {section.articles.length} article{section.articles.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {expandedSection === section.id ? (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedSection === section.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="space-y-3 mt-4">
                      {section.articles.map((article, index) => (
                        <div
                          key={index}
                          id={`article-${section.id}-${index}`}
                          className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 transition-all duration-300 ${
                            activeArticle?.section === section.id && activeArticle?.index === index
                              ? 'ring-2 ring-blue-500 shadow-lg'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-800 dark:text-white text-lg">
                              {highlightText(article.title, searchTerm)}
                            </h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                            {highlightText(article.content, searchTerm)}
                          </p>
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {article.tags.map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                <Search className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or browse the categories above
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-3xl mx-auto text-center">
          <MessageCircle className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Can't find what you're looking for? Our support team is here to help you succeed on your typing journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              <Users className="w-5 h-5" />
              <span>Contact Support</span>
            </a>
            <a
              href="mailto:support@typemaster.com"
              className="flex items-center justify-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
            >
              <Award className="w-5 h-5" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Ready to improve your typing skills?
          </h3>
          <a
            href="/practice"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Start Practicing Now</span>
          </a>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default App;