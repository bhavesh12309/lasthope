import React, { useState } from 'react';
import { Globe, Type, Book, Target, Clock } from 'lucide-react';

const MultiLanguageTyping = ({ onSelectLesson, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedScript, setSelectedScript] = useState('latin');
  const [showTransliteration, setShowTransliteration] = useState(false);

  const languages = {
    english: {
      name: 'English',
      script: 'latin',
      flag: '🇺🇸',
      lessons: [
        {
          id: 'en-basic',
          title: 'English Basics',
          text: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
          difficulty: 'Beginner',
          category: 'basics',
        },
        {
          id: 'en-business',
          title: 'Business English',
          text: 'Dear colleagues, I am writing to inform you about the upcoming quarterly meeting scheduled for next Tuesday.',
          difficulty: 'Intermediate',
          category: 'business',
        },
        {
          id: 'en-programming',
          title: 'Programming Terms',
          text: 'function variable array object method class interface boolean string number undefined null return import export const let var async await promise callback',
          difficulty: 'Advanced',
          category: 'programming',
        },
      ],
    },
    spanish: {
      name: 'Español',
      script: 'latin',
      flag: '🇪🇸',
      lessons: [
        {
          id: 'es-basic',
          title: 'Español Básico',
          text: 'El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.',
          difficulty: 'Beginner',
          category: 'basics',
        },
        {
          id: 'es-literature',
          title: 'Literatura Española',
          text: 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo.',
          difficulty: 'Intermediate',
          category: 'literature',
        },
        {
          id: 'es-conversation',
          title: 'Conversación Diaria',
          text: 'Hola, ¿cómo estás? Me llamo María. ¿De dónde eres? Soy de México. ¿Qué te gusta hacer en tu tiempo libre?',
          difficulty: 'Intermediate',
          category: 'conversation',
        },
      ],
    },
    hindi: {
      name: 'हिंदी',
      script: 'devanagari',
      flag: '🇮🇳',
      lessons: [
        {
          id: 'hi-basic',
          title: 'हिंदी मूल बातें',
          text: 'अ आ इ ई उ ऊ ए ऐ ओ औ अं अः क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह',
          difficulty: 'Beginner',
          category: 'basics',
          transliteration: 'a aa i ii u uu e ai o au am ah ka kha ga gha nga cha chha ja jha nya ta tha da dha na ta tha da dha na pa pha ba bha ma ya ra la va sha sha sa ha',
        },
        {
          id: 'hi-words',
          title: 'हिंदी शब्द',
          text: 'नमस्ते मेरा नाम राम है। मैं भारत से हूँ। मुझे हिंदी टाइपिंग सीखना है।',
          difficulty: 'Intermediate',
          category: 'basics',
          transliteration: 'namaste mera naam raam hai. main bharat se hun. mujhe hindi typing seekhna hai.',
        },
        {
          id: 'hi-numbers',
          title: 'हिंदी संख्याएं',
          text: 'एक दो तीन चार पांच छह सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस बीस',
          difficulty: 'Beginner',
          category: 'numbers',
          transliteration: 'ek do teen char paanch chah saat aath nau das gyaarah baarah terah chaudah pandrah solah satrah athaarah unnis bees',
        },
      ],
    },
    japanese: {
      name: '日本語',
      script: 'hiragana',
      flag: '🇯🇵',
      lessons: [
        {
          id: 'jp-hiragana',
          title: 'ひらがな練習',
          text: 'あいうえお かきくけこ さしすせそ たちつてと なにぬねの はひふへほ まみむめも やゆよ らりるれろ わをん',
          difficulty: 'Beginner',
          category: 'basics',
          transliteration: 'aiueo kakikukeko sashisuseso tachitsuteto naninuneno hahifuheho mamimumemo yayuyo rarirurero wawon',
        },
        {
          id: 'jp-words',
          title: '日本語の単語',
          text: 'こんにちは。わたしの なまえは たなかです。にほんから きました。',
          difficulty: 'Intermediate',
          category: 'basics',
          transliteration: 'konnichiwa. watashi no namae wa tanaka desu. nihon kara kimashita.',
        },
        {
          id: 'jp-katakana',
          title: 'カタカナ練習',
          text: 'アイウエオ カキクケコ サシスセソ タチツテト ナニヌネノ ハヒフヘホ マミムメモ ヤユヨ ラリルレロ ワヲン',
          difficulty: 'Intermediate',
          category: 'katakana',
          transliteration: 'aiueo kakikukeko sashisuseso tachitsuteto naninuneno hahifuheho mamimumemo yayuyo rarirurero wawon',
        },
      ],
    },
    french: {
      name: 'Français',
      script: 'latin',
      flag: '🇫🇷',
      lessons: [
        {
          id: 'fr-basic',
          title: 'Français de base',
          text: 'Bonjour, je suis très heureux de vous rencontrer. Comment allez-vous aujourd\'hui?',
          difficulty: 'Beginner',
          category: 'basics',
        },
        {
          id: 'fr-literature',
          title: 'Littérature française',
          text: 'Il était une fois, dans un pays lointain, un roi qui avait trois fils très courageux.',
          difficulty: 'Intermediate',
          category: 'literature',
        },
        {
          id: 'fr-cuisine',
          title: 'Cuisine Française',
          text: 'Les ingrédients pour cette recette sont: beurre, farine, œufs, lait, sucre, vanille, chocolat, et une pincée de sel.',
          difficulty: 'Intermediate',
          category: 'cuisine',
        },
      ],
    },
    german: {
      name: 'Deutsch',
      script: 'latin',
      flag: '🇩🇪',
      lessons: [
        {
          id: 'de-basic',
          title: 'Deutsch Grundlagen',
          text: 'Guten Tag! Wie geht es Ihnen? Ich freue mich sehr, Sie kennenzulernen.',
          difficulty: 'Beginner',
          category: 'basics',
        },
        {
          id: 'de-business',
          title: 'Geschäftsdeutsch',
          text: 'Sehr geehrte Damen und Herren, hiermit möchte ich mich für die ausgeschriebene Stelle bewerben.',
          difficulty: 'Advanced',
          category: 'business',
        },
      ],
    },
    chinese: {
      name: '中文',
      script: 'chinese',
      flag: '🇨🇳',
      lessons: [
        {
          id: 'zh-basic',
          title: '中文基础',
          text: '你好，我叫李明。我是中国人。我喜欢学习中文打字。',
          difficulty: 'Beginner',
          category: 'basics',
          transliteration: 'nǐ hǎo, wǒ jiào lǐ míng. wǒ shì zhōng guó rén. wǒ xǐ huān xué xí zhōng wén dǎ zì.',
        },
        {
          id: 'zh-numbers',
          title: '中文数字',
          text: '一二三四五六七八九十百千万亿',
          difficulty: 'Beginner',
          category: 'numbers',
          transliteration: 'yī èr sān sì wǔ liù qī bā jiǔ shí bǎi qiān wàn yì',
        },
      ],
    },
    arabic: {
      name: 'العربية',
      script: 'arabic',
      flag: '🇸🇦',
      lessons: [
        {
          id: 'ar-basic',
          title: 'العربية الأساسية',
          text: 'أهلاً وسهلاً. اسمي أحمد. أنا من المملكة العربية السعودية.',
          difficulty: 'Beginner',
          category: 'basics',
          transliteration: 'ahlan wa sahlan. ismi ahmad. ana min al-mamlaka al-arabiyya al-saudiyya.',
        },
        {
          id: 'ar-alphabet',
          title: 'الأبجدية العربية',
          text: 'أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي',
          difficulty: 'Beginner',
          category: 'alphabet',
          transliteration: 'alif ba ta tha jim ha kha dal dhal ra zay sin shin sad dad ta za ayn ghayn fa qaf kaf lam mim nun ha waw ya',
        },
      ],
    },
  };

  const currentLanguage = languages[selectedLanguage];

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    setSelectedScript(languages[langCode].script);
  };

  const handleLessonSelect = (lesson) => {
    const enhancedLesson = {
      ...lesson,
      language: selectedLanguage,
      script: selectedScript,
      icon: <Globe className="w-6 h-6 text-white" />,
      estimatedTime: '8 min',
      wpmTarget: 30,
      accuracyTarget: 90,
      tags: ['multilingual', selectedLanguage],
    };
    onSelectLesson(enhancedLesson);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Multilingual</span>
            <br />
            <span className="text-gray-800 dark:text-white">Typing Practice</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Practice typing in different languages and scripts to become a global typist.
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Select Language
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageSelect(code)}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  selectedLanguage === code
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="font-semibold">{lang.name}</div>
                <div className="text-sm opacity-75">{lang.script}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Language Info */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {currentLanguage.flag} {currentLanguage.name} Lessons
            </h3>
            
            {/* Transliteration Toggle for non-Latin scripts */}
            {currentLanguage.script !== 'latin' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showTransliteration}
                  onChange={(e) => setShowTransliteration(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Show Transliteration
                </span>
              </label>
            )}
          </div>

          {/* Script Information */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Type className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Script</span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 capitalize">{currentLanguage.script}</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Book className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-300">Lessons</span>
              </div>
              <p className="text-green-600 dark:text-green-400">{currentLanguage.lessons.length} Available</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-purple-700 dark:text-purple-300">Focus</span>
              </div>
              <p className="text-purple-600 dark:text-purple-400">Character Recognition</p>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {currentLanguage.lessons.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => handleLessonSelect(lesson)}
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl">{currentLanguage.flag}</div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lesson.title}
                </h3>

                {/* Text Preview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 dark:text-gray-200 font-mono text-lg leading-relaxed mb-2">
                    {lesson.text.substring(0, 100)}...
                  </p>
                  
                  {/* Transliteration */}
                  {showTransliteration && lesson.transliteration && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      {lesson.transliteration.substring(0, 100)}...
                    </p>
                  )}
                </div>

                {/* Lesson Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{lesson.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>8 min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Typing Tips for Non-Latin Scripts */}
        {currentLanguage.script !== 'latin' && (
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
              Typing Tips for {currentLanguage.name}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700 dark:text-yellow-300">
              <div>
                <h4 className="font-medium mb-2">Input Method:</h4>
                <p>Use your system's input method editor (IME) or enable the appropriate keyboard layout for {currentLanguage.name}.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Practice Strategy:</h4>
                <p>Start with basic characters and gradually progress to words and sentences. Focus on accuracy over speed initially.</p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiLanguageTyping;