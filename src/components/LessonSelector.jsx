import React from 'react';
import { BookOpen, Clock, Target, Zap, Globe, Code, Brain, Gamepad2, Type, Users } from 'lucide-react';

const LessonSelector = ({ onSelectLesson }) => {
  const lessonCategories = [
    {
      id: 'progressive',
      name: 'Progressive Learning',
      icon: Target,
      color: 'bg-green-500',
      lessons: [
        {
          id: 'home-row-basics',
          title: 'Home Row Basics',
          description: 'Master the foundation keys: ASDF JKL;',
          text: 'asdf jkl; asdf jkl; asd fjkl; asd fjkl; sad lad ask dad fall all shalllass glass',
          difficulty: 'Beginner',
          duration: '8 min',
          wpmTarget: 20,
          accuracyTarget: 90,
          level: 1,
          category: 'home-row',
        },
        {
          id: 'home-row-words',
          title: 'Home Row Words',
          description: 'Form words using only home row keys',
          text: 'ask dad sad lad fall all shall lass glass flask flask ask dad sad lad fall all shall lass glass flask',
          difficulty: 'Beginner',
          duration: '10 min',
          wpmTarget: 25,
          accuracyTarget: 92,
          level: 2,
          category: 'home-row',
        },
        {
          id: 'top-row-intro',
          title: 'Top Row Introduction',
          description: 'Add top row keys: QWERT YUIOP',
          text: 'qwert yuiop qwert yuiop quit your power tower query quote quite quilt',
          difficulty: 'Beginner',
          wpmTarget: 28,
          accuracyTarget: 88,
          level: 3,
          category: 'top-row',
        },
        {
          id: 'top-row-practice',
          title: 'Top Row Practice',
          description: 'Combine home row with top row keys',
          text: 'quit your power tower query quote quite quilt type write port sort word work',
          difficulty: 'Beginner',
          duration: '12 min',
          wpmTarget: 30,
          accuracyTarget: 90,
          level: 4,
          category: 'top-row',
        },
        {
          id: 'bottom-row-intro',
          title: 'Bottom Row Introduction',
          description: 'Add bottom row keys: ZXCVB NM',
          text: 'zxcvb nm zxcvb nm zone exam cave verb barn name zoom mix cave verb barn name',
          difficulty: 'Intermediate',
          duration: '10 min',
          wpmTarget: 32,
          accuracyTarget: 88,
          level: 5,
          category: 'bottom-row',
        },
        {
          id: 'all-letters',
          title: 'All Letters Combined',
          description: 'Practice with all alphabet keys together',
          text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
          difficulty: 'Intermediate',
          duration: '15 min',
          wpmTarget: 35,
          accuracyTarget: 90,
          level: 6,
          category: 'full-alphabet',
        },
        {
          id: 'numbers-symbols',
          title: 'Numbers and Symbols',
          description: 'Master the number row and common symbols',
          text: '1234567890 !@#$%^&*() The price is $29.99 for item #1234. Call (555) 123-4567 today!',
          difficulty: 'Intermediate',
          duration: '12 min',
          wpmTarget: 30,
          accuracyTarget: 85,
          level: 7,
          category: 'numbers-symbols',
        },
        {
          id: 'punctuation-practice',
          title: 'Punctuation Mastery',
          description: 'Practice with all punctuation marks',
          text: 'Hello, world! How are you? I\'m fine, thanks. "Great!" he said. It\'s 3:30 PM. Email: user@example.com',
          difficulty: 'Intermediate',
          duration: '10 min',
          wpmTarget: 32,
          accuracyTarget: 88,
          level: 8,
          category: 'punctuation',
        },
        {
          id: 'common-words',
          title: 'Common Words Practice',
          description: 'Practice with the most frequently used English words',
          text: 'the and for are but not you all can had her was one our out day get has him his how man new now old see two way who boy did its let put say she too use',
          difficulty: 'Intermediate',
          duration: '15 min',
          wpmTarget: 40,
          accuracyTarget: 92,
          level: 9,
          category: 'common-words',
        },
        {
          id: 'sentences-basic',
          title: 'Simple Sentences',
          description: 'Practice typing complete sentences with proper punctuation',
          text: 'The cat sat on the mat. Dogs love to play in the park. Birds fly high in the sky. Fish swim in the deep blue sea.',
          difficulty: 'Intermediate',
          duration: '12 min',
          wpmTarget: 28,
          accuracyTarget: 88,
          level: 10,
          category: 'sentences',
        },
        {
          id: 'paragraphs-basic',
          title: 'Basic Paragraphs',
          description: 'Practice typing longer text passages',
          text: 'Learning to type is an essential skill in today\'s digital world. With practice and dedication, anyone can improve their typing speed and accuracy. Start slowly and focus on proper finger placement.',
          difficulty: 'Intermediate',
          duration: '15 min',
          wpmTarget: 35,
          accuracyTarget: 90,
          level: 11,
          category: 'paragraphs',
        },
        {
          id: 'difficult-words',
          title: 'Challenging Words',
          description: 'Practice with difficult letter combinations',
          text: 'rhythm psychology pneumonia mnemonic xylophone zephyr fjord awkward strength through thought brought',
          difficulty: 'Advanced',
          duration: '10 min',
          wpmTarget: 30,
          accuracyTarget: 85,
          level: 12,
          category: 'difficult',
        },
        {
          id: 'speed-building',
          title: 'Speed Building',
          description: 'Focus on increasing typing speed while maintaining accuracy',
          text: 'Quick fast type speed rush zoom dash bolt race swift rapid hasty brisk fleet nimble agile prompt instant immediate urgent',
          difficulty: 'Advanced',
          duration: '8 min',
          wpmTarget: 50,
          accuracyTarget: 88,
          level: 13,
          category: 'speed',
        },
        {
          id: 'advanced-paragraphs',
          title: 'Advanced Paragraphs',
          description: 'Complex text with varied vocabulary and punctuation',
          text: 'The technological revolution has fundamentally transformed how we communicate, work, and interact with information. Artificial intelligence, machine learning, and automation are reshaping industries at an unprecedented pace.',
          difficulty: 'Advanced',
          duration: '20 min',
          wpmTarget: 45,
          accuracyTarget: 92,
          level: 14,
          category: 'advanced',
        },
        {
          id: 'expert-challenge',
          title: 'Expert Challenge',
          description: 'Ultimate typing test with complex vocabulary',
          text: 'Perspicacious individuals demonstrate extraordinary capabilities when confronting multifaceted challenges that require sophisticated analytical methodologies and comprehensive understanding of intricate theoretical frameworks.',
          difficulty: 'Expert',
          duration: '15 min',
          wpmTarget: 60,
          accuracyTarget: 95,
          level: 15,
          category: 'expert',
        },
      ]
    },
    {
      id: 'basics',
      name: 'Quick Practice',
      icon: Zap,
      color: 'bg-blue-500',
      lessons: [
        {
          id: 'quick-warmup',
          title: 'Quick Warm-up',
          description: 'Short practice session to get started',
          text: 'the quick brown fox jumps over the lazy dog',
          difficulty: 'Beginner',
          duration: '3 min',
          wpmTarget: 25,
          accuracyTarget: 90,
        },
      ]
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: Code,
      color: 'bg-blue-500',
      lessons: [
        {
          id: 'javascript-basics',
          title: 'JavaScript Basics',
          description: 'Practice common JavaScript syntax and keywords',
          text: 'function calculateSum(a, b) { return a + b; } const numbers = [1, 2, 3, 4, 5]; const doubled = numbers.map(n => n * 2); console.log(doubled);',
          difficulty: 'Intermediate',
          duration: '15 min',
          wpmTarget: 35,
          accuracyTarget: 88,
        },
        {
          id: 'python-syntax',
          title: 'Python Syntax',
          description: 'Learn to type Python code efficiently',
          text: 'def fibonacci(n): if n <= 1: return n else: return fibonacci(n-1) + fibonacci(n-2) for i in range(10): print(fibonacci(i))',
          difficulty: 'Intermediate',
          duration: '12 min',
          wpmTarget: 32,
          accuracyTarget: 90,
        },
        {
          id: 'html-css',
          title: 'HTML & CSS',
          description: 'Practice web development markup and styling',
          text: '<div class="container"><h1 id="title">Welcome</h1><p class="description">This is a paragraph with <span style="color: blue;">blue text</span>.</p></div>',
          difficulty: 'Intermediate',
          duration: '10 min',
          wpmTarget: 30,
          accuracyTarget: 92,
        },
      ]
    },
    {
      id: 'literature',
      name: 'Literature',
      icon: BookOpen,
      color: 'bg-purple-500',
      lessons: [
        {
          id: 'classic-quotes',
          title: 'Classic Quotes',
          description: 'Type famous quotes from literature',
          text: 'To be or not to be, that is the question. It was the best of times, it was the worst of times. All that glitters is not gold.',
          difficulty: 'Intermediate',
          duration: '10 min',
          wpmTarget: 40,
          accuracyTarget: 95,
        },
        {
          id: 'poetry',
          title: 'Poetry Practice',
          description: 'Practice typing beautiful poetry',
          text: 'Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could',
          difficulty: 'Advanced',
          duration: '15 min',
          wpmTarget: 45,
          accuracyTarget: 96,
        },
        {
          id: 'shakespeare',
          title: 'Shakespeare',
          description: 'Master the Bard\'s timeless words',
          text: 'Shall I compare thee to a summer\'s day? Thou art more lovely and more temperate. Rough winds do shake the darling buds of May.',
          difficulty: 'Advanced',
          duration: '12 min',
          wpmTarget: 42,
          accuracyTarget: 94,
        },
      ]
    },
    {
      id: 'business',
      name: 'Business',
      icon: Users,
      color: 'bg-orange-500',
      lessons: [
        {
          id: 'email-writing',
          title: 'Business Emails',
          description: 'Practice professional email communication',
          text: 'Dear Mr. Johnson, I hope this email finds you well. I am writing to follow up on our meeting last Tuesday regarding the quarterly sales report.',
          difficulty: 'Intermediate',
          duration: '12 min',
          wpmTarget: 38,
          accuracyTarget: 94,
        },
        {
          id: 'reports',
          title: 'Business Reports',
          description: 'Practice formal business writing',
          text: 'The quarterly analysis indicates a 15% increase in revenue compared to the previous period. Key performance indicators show positive trends across all departments.',
          difficulty: 'Advanced',
          duration: '15 min',
          wpmTarget: 40,
          accuracyTarget: 96,
        },
      ]
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: Gamepad2,
      color: 'bg-red-500',
      lessons: [
        {
          id: 'gaming-terms',
          title: 'Gaming Terminology',
          description: 'Learn to type gaming terms quickly',
          text: 'respawn checkpoint achievement multiplayer campaign strategy RPG FPS MMORPG guild raid boss level up experience points',
          difficulty: 'Intermediate',
          duration: '10 min',
          wpmTarget: 42,
          accuracyTarget: 90,
        },
        {
          id: 'esports',
          title: 'Esports Commentary',
          description: 'Fast-paced gaming commentary practice',
          text: 'Amazing headshot! The player flanked around the corner and eliminated three enemies with precision aim. What an incredible play!',
          difficulty: 'Advanced',
          duration: '8 min',
          wpmTarget: 55,
          accuracyTarget: 88,
        },
      ]
    },
    {
      id: 'multilingual',
      name: 'Multilingual',
      icon: Globe,
      color: 'bg-indigo-500',
      lessons: [
        {
          id: 'spanish-basic',
          title: 'Spanish Basics',
          description: 'Practice typing in Spanish',
          text: 'Hola, ¿cómo estás? Me llamo María. Soy de España. Me gusta aprender idiomas.',
          difficulty: 'Beginner',
          duration: '8 min',
          wpmTarget: 28,
          accuracyTarget: 88,
        },
        {
          id: 'french-basic',
          title: 'French Basics',
          description: 'Practice typing in French',
          text: 'Bonjour, comment allez-vous? Je m\'appelle Pierre. Je suis français. J\'aime la musique.',
          difficulty: 'Beginner',
          duration: '8 min',
          wpmTarget: 28,
          accuracyTarget: 88,
        },
        {
          id: 'german-basic',
          title: 'German Basics',
          description: 'Practice typing in German',
          text: 'Guten Tag! Wie geht es Ihnen? Ich heiße Anna. Ich komme aus Deutschland. Ich lerne gerne neue Sprachen.',
          difficulty: 'Beginner',
          duration: '8 min',
          wpmTarget: 26,
          accuracyTarget: 90,
        },
      ]
    }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-100';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Advanced':
        return 'text-red-600 bg-red-100';
      case 'Expert':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleLessonSelect = (lesson) => {
    onSelectLesson && onSelectLesson({ 
      ...lesson, 
      icon: <Type className="w-6 h-6 text-white" />,
      content: lesson.text // Ensure content is available for the typing interface
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Choose Your</span>
            <br />
            <span className="text-gray-800 dark:text-white">Lesson</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select a typing lesson to improve your skills and track your progress
          </p>
        </div>
      
      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessonCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{category.lessons.length} lessons available</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              ← Back to Categories
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-lg ${selectedCategory.color}`}>
                <selectedCategory.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedCategory.name} Lessons</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory.lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson)}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${selectedCategory.color} group-hover:scale-110 transition-transform`}>
                      <selectedCategory.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{lesson.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{lesson.description}</p>
                  
                  {/* Progress indicator for progressive lessons */}
                  {lesson.level && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Level {lesson.level}</span>
                        <span>{lesson.category}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(lesson.level / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      <span>{lesson.wpmTarget} WPM</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium transform group-hover:scale-105">
                    Start Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default LessonSelector;