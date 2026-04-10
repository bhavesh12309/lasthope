import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import LessonCompleteScreen from './LessonCompleteScreen'
import { useUser } from '../contexts/UserContext'
import {
  Play,
  Pause,
  RotateCcw,
  Moon,
  Sun,
  Trophy,
  Target,
  Zap,
  Keyboard,
  Star,
  BookOpen,
  TrendingUp,
  Timer,
  Lock,
  Check,
  X,
  Code,
  ArrowLeft,
  Heart,
  Flame,
  CheckCircle,
  Volume2,
  VolumeX
} from 'lucide-react';

const LESSON_CATEGORIES = {
  progressive: {
    name: 'Progressive Learning',
    icon: Target,
    color: 'bg-green-500',
    description: 'Structured progression from basics to expert level',
    lessons: [
      { id: 'home-row-basics', title: 'Home Row Basics', description: 'Master the foundation keys', text: 'asdf jkl; asdf jkl; sad lad ask dad fall all shall lass glass', difficulty: 'Beginner', duration: '8 min', wpmTarget: 20 },
      { id: 'home-row-words', title: 'Home Row Words', description: 'Form words using home row keys', text: 'ask dad sad lad fall all shall lass glass flask', difficulty: 'Beginner', duration: '10 min', wpmTarget: 25 },
      { id: 'all-letters', title: 'All Letters Combined', description: 'Practice with all alphabet keys', text: 'The quick brown fox jumps over the lazy dog', difficulty: 'Intermediate', duration: '15 min', wpmTarget: 35 },
      { id: 'beginner-words-1', title: 'Beginner Words 1', description: 'Simple short words', text: 'cat dog sun run bag tag map nap tap sap', difficulty: 'Beginner', duration: '8 min', wpmTarget: 20 },

      { id: 'beginner-words-2', title: 'Beginner Words 2', description: 'More short words', text: 'pen hen ten men fan pan can ran tan ban', difficulty: 'Beginner', duration: '8 min', wpmTarget: 22 },
      
      { id: 'beginner-sentences-1', title: 'Beginner Sentences 1', description: 'Easy sentences', text: 'The sun is up. The cat can run. I see a big red bus.', difficulty: 'Beginner', duration: '9 min', wpmTarget: 23 },
      
      { id: 'beginner-sentences-2', title: 'Beginner Sentences 2', description: 'Simple sentence practice', text: 'A dog sat on a mat. The man has a hat. We see a long road.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 24 },
      
      { id: 'beginner-keys-1', title: 'Letter Focus: E & I', description: 'Improve mid-row accuracy', text: 'see ice nice rise wise like live dive five', difficulty: 'Beginner', duration: '8 min', wpmTarget: 22 },
      
      { id: 'beginner-keys-2', title: 'Letter Focus: T & H', description: 'Practice common letters', text: 'the that then thin path math bath hath', difficulty: 'Beginner', duration: '8 min', wpmTarget: 22 },
      
      { id: 'numbers-row-1', title: 'Numbers Row Practice 1', description: 'Basic number typing', text: '1 2 3 4 5 6 7 8 9 0 123 456 789 012', difficulty: 'Beginner', duration: '6 min', wpmTarget: 18 },
      
      { id: 'numbers-row-2', title: 'Numbers Row Practice 2', description: 'Numbers with words', text: 'Room 21 has 3 big desks and 5 small chairs.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 20 },
      
      { id: 'punctuation-1', title: 'Punctuation Basics', description: 'Commas, periods and question marks', text: 'Hello, how are you? I am fine. This is great, right?', difficulty: 'Beginner', duration: '10 min', wpmTarget: 22 },
      
      { id: 'punctuation-2', title: 'Quotation Marks', description: 'Learn quotes and commas', text: '"Stop that," she said. "We need to go," he replied.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 23 },
      
      // INTERMEDIATE LEVEL
      
      { id: 'intermediate-words-1', title: 'Intermediate Words 1', description: 'Longer words practice', text: 'center market station process animal journey manage create', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 30 },
      
      { id: 'intermediate-words-2', title: 'Intermediate Words 2', description: 'Complex vocabulary', text: 'fantastic gravity digital harmony explore energy vision', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'intermediate-sentences-1', title: 'Intermediate Sentences 1', description: 'Longer sentences', text: 'The early morning breeze carried the scent of fresh rain across the valley.', difficulty: 'Intermediate', duration: '15 min', wpmTarget: 34 },
      
      { id: 'intermediate-sentences-2', title: 'Intermediate Sentences 2', description: 'Balanced sentence flow', text: 'Learning to type faster requires patience, focus, and regular practice.', difficulty: 'Intermediate', duration: '15 min', wpmTarget: 34 },
      
      { id: 'intermediate-paragraph-1', title: 'Intermediate Paragraph 1', description: 'Small paragraph', text: 'Typing skills improve as you train your fingers to move with accuracy and speed. Daily practice helps build strong habits and boosts confidence.', difficulty: 'Intermediate', duration: '18 min', wpmTarget: 35 },
      
      { id: 'intermediate-paragraph-2', title: 'Intermediate Paragraph 2', description: 'Flow and rhythm', text: 'When you begin typing regularly, each letter becomes easier to find. Your hands start to memorize patterns, making you faster without effort.', difficulty: 'Intermediate', duration: '18 min', wpmTarget: 35 },
      
      { id: 'intermediate-symbols-1', title: 'Symbols Practice 1', description: 'Symbols and punctuation', text: '@ # % & * $ ! ? + = — — : ;', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 28 },
      
      { id: 'intermediate-symbols-2', title: 'Symbols Practice 2', description: 'Symbols in sentences', text: 'The price was $25, but with a 10% discount, it cost only $22.50.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 30 },
      
      { id: 'intermediate-dialogue-1', title: 'Dialogue Practice', description: 'Typing character dialogue', text: '"Where are we going?" he asked. "To the old station," she replied calmly.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'intermediate-story-1', title: 'Micro Story 1', description: 'Short storytelling practice', text: 'A strange light appeared in the sky, pulsing softly as if calling out to anyone watching.', difficulty: 'Intermediate', duration: '14 min', wpmTarget: 34 },
      
      // ADVANCED LEVEL
      
      { id: 'advanced-words-1', title: 'Advanced Words 1', description: 'High-level vocabulary', text: 'algorithm fragment sequence infinite variable dynamic abstract function', difficulty: 'Advanced', duration: '16 min', wpmTarget: 40 },
      
      { id: 'advanced-words-2', title: 'Advanced Words 2', description: 'Challenging words', text: 'philosophy perception equilibrium authenticity resonance elevation', difficulty: 'Advanced', duration: '16 min', wpmTarget: 42 },
      
      { id: 'advanced-paragraph-1', title: 'Advanced Paragraph 1', description: 'High detail paragraph', text: 'Human creativity thrives when curiosity meets discipline. The ability to explore unfamiliar ideas while refining existing skills is the root of innovation.', difficulty: 'Advanced', duration: '20 min', wpmTarget: 40 },
      
      { id: 'advanced-paragraph-2', title: 'Advanced Paragraph 2', description: 'Long, smooth text', text: 'Technology continues to transform our world at a rapid pace. Mastering digital communication tools, like typing, has become more essential than ever.', difficulty: 'Advanced', duration: '20 min', wpmTarget: 41 },
      
      { id: 'advanced-technical-1', title: 'Technical Terms 1', description: 'Technical vocabulary', text: 'processor memory interface architecture compiler network protocol database module', difficulty: 'Advanced', duration: '18 min', wpmTarget: 40 },
      
      { id: 'advanced-technical-2', title: 'Technical Terms 2', description: 'More advanced tech words', text: 'iteration framework optimization encryption algorithmic latency integration', difficulty: 'Advanced', duration: '18 min', wpmTarget: 42 },
      
      { id: 'advanced-dialogue-1', title: 'Advanced Dialogue', description: 'Complex conversation', text: '"If we modify the core system now, we might destabilize the network," she warned quietly.', difficulty: 'Advanced', duration: '18 min', wpmTarget: 41 },
      
      { id: 'advanced-story-1', title: 'Micro Story 2', description: 'Short dramatic piece', text: 'The research team watched the monitor anxiously as the data spiked beyond anything they had predicted.', difficulty: 'Advanced', duration: '19 min', wpmTarget: 42 },
      
      { id: 'advanced-logic-1', title: 'Logic Patterns', description: 'Pattern-based typing', text: 'abc abc abc abz abz abz xyz xyz xyz xyzl', difficulty: 'Advanced', duration: '14 min', wpmTarget: 39 },
      
      // EXPERT LEVEL
      
      { id: 'expert-words-1', title: 'Expert Words 1', description: 'Very challenging words', text: 'synchronization multidimensional recalibration hyperintelligent bioluminescent', difficulty: 'Expert', duration: '20 min', wpmTarget: 45 },
      
      { id: 'expert-words-2', title: 'Expert Words 2', description: 'Longest words set', text: 'counterintuitive intercommunication disproportionately transformational', difficulty: 'Expert', duration: '22 min', wpmTarget: 46 },
      
      { id: 'expert-paragraph-1', title: 'Expert Paragraph 1', description: 'Advanced reasoning paragraph', text: 'In an age of accelerating complexity, the ability to process information swiftly is a valuable asset. Skills like typing sharpen cognitive agility and help manage high workloads.', difficulty: 'Expert', duration: '25 min', wpmTarget: 47 },
      
      { id: 'expert-paragraph-2', title: 'Expert Paragraph 2', description: 'High challenge content', text: 'To excel in modern environments, individuals must adapt continuously. Precision, adaptability, and speed form the core of effective digital communication.', difficulty: 'Expert', duration: '25 min', wpmTarget: 47 },
      
      { id: 'expert-mixed-1', title: 'Expert Mixed Practice', description: 'Mixed symbols + long words', text: 'Encryption@2025 requires fast, accurate typing—especially when dealing with $data, %values, and algorithm-intensive processes.', difficulty: 'Expert', duration: '18 min', wpmTarget: 45 },
      
      { id: 'expert-story-1', title: 'Micro Story 3', description: 'Expert-level storyline', text: 'The spacecraft drifted through silent darkness as the crew prepared for a mission that would decide the fate of their entire colony.', difficulty: 'Expert', duration: '26 min', wpmTarget: 48 },
      
      { id: 'expert-dialogue-1', title: 'Expert Dialogue', description: 'Fast-paced dialogue', text: '"We only get one chance," he said sharply. "Then let’s make it count," she replied without hesitation.', difficulty: 'Expert', duration: '20 min', wpmTarget: 45 },
      
      { id: 'expert-precision-1', title: 'Precision Challenge', description: 'High accuracy task', text: 'Precision typing requires strong focus, steady hand movement, and minimal errors at high speeds.', difficulty: 'Expert', duration: '18 min', wpmTarget: 48 },
      
      { id: 'expert-ultra-1', title: 'Ultra Challenge', description: 'Final expert test', text: 'Typing mastery is achieved through continuous adaptation, refined technique, and the ability to sustain peak performance under pressure.', difficulty: 'Expert', duration: '28 min', wpmTarget: 50 },
      
    ]
  },
  basics: {
    name: 'Quick Practice',
    icon: Zap,
    color: 'bg-blue-500',
    description: 'Short practice sessions',
    lessons: [
      { id: 'basic-1', title: 'Quick Warm-up', description: 'Short practice session', text: 'the quick brown fox jumps over the lazy dog', difficulty: 'Beginner', duration: '3 min', wpmTarget: 25 },
      { id: 'basic-2', title: 'Speed Test', description: 'Test your typing speed', text: 'The five boxing wizards jump quickly and swiftly', difficulty: 'Intermediate', duration: '5 min', wpmTarget: 40 },
      { id: 'basic-3', title: 'Rapid Words', description: 'Quick random words', text: 'glass mint jump soft rapid bold clean sharp fresh brave', difficulty: 'Beginner', duration: '3 min', wpmTarget: 28 },

      { id: 'basic-4', title: 'Short Burst', description: 'Fast burst practice', text: 'speed boost quick tap snap clap track crack flip slip', difficulty: 'Beginner', duration: '3 min', wpmTarget: 27 },
      
      { id: 'basic-5', title: 'Mini Sentences', description: 'Very short sentences', text: 'The rain fell fast. Birds flew high. The road was long.', difficulty: 'Beginner', duration: '4 min', wpmTarget: 26 },
      
      { id: 'basic-6', title: 'Mix Words 1', description: 'Common typing words', text: 'time light move right small great bright night sound', difficulty: 'Beginner', duration: '3 min', wpmTarget: 27 },
      
      { id: 'basic-7', title: 'Easy Flow', description: 'Smooth typing flow', text: 'Calm minds work better when thoughts flow clearly and slowly.', difficulty: 'Beginner', duration: '4 min', wpmTarget: 27 },
      
      { id: 'basic-8', title: 'Left Hand Drill', description: 'Left-hand keys only', text: 'sad dad fad lad ask flask draft class salad', difficulty: 'Beginner', duration: '3 min', wpmTarget: 25 },
      
      { id: 'basic-9', title: 'Right Hand Drill', description: 'Right-hand keys only', text: 'jill fill hill kill mill skill shell fresh thrill', difficulty: 'Beginner', duration: '3 min', wpmTarget: 25 },
      
      { id: 'basic-10', title: 'Quick Symbols', description: 'Practice symbols lightly', text: '! ? . , : ; ! ? , . ; :', difficulty: 'Beginner', duration: '3 min', wpmTarget: 24 },
      
      { id: 'basic-11', title: 'Quick Digits', description: 'Number key warm-up', text: '1 2 3 4 5 6 7 8 9 0 123 456 789 012', difficulty: 'Beginner', duration: '3 min', wpmTarget: 25 },
      
      // INTERMEDIATE
      
      { id: 'basic-12', title: 'Speed Words 1', description: 'Fast random words', text: 'motion rapid strike flash power level charge swift sense', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 32 },
      
      { id: 'basic-13', title: 'Speed Words 2', description: 'Medium complexity words', text: 'creative digital harmony texture orbit signal expand refine', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 33 },
      
      { id: 'basic-14', title: 'Mini Paragraph 1', description: 'Short quick paragraph', text: 'Quick practice improves overall typing speed by sharpening reflexes and building confidence.', difficulty: 'Intermediate', duration: '5 min', wpmTarget: 34 },
      
      { id: 'basic-15', title: 'Mini Paragraph 2', description: 'Short detailed text', text: 'Typing for just a few minutes daily can dramatically boost your accuracy and hand rhythm.', difficulty: 'Intermediate', duration: '5 min', wpmTarget: 34 },
      
      { id: 'basic-16', title: 'Quick Dialogue', description: 'Short conversation lines', text: '"Ready?" she asked. "Let’s go!" he replied without delay.', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 35 },
      
      { id: 'basic-17', title: 'Random Short', description: 'Fast unpredictable text', text: 'Stone drift crash spark float rush glide track shine', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 33 },
      
      { id: 'basic-18', title: 'Fast Punctuation', description: 'Speed punctuation mix', text: 'Wait, stop! Go now. Why me? Yes, sure; okay!', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 32 },
      
      { id: 'basic-19', title: 'Tight Sentences', description: 'Sentences with flow', text: 'Small habits create big results over time when practiced consistently.', difficulty: 'Intermediate', duration: '5 min', wpmTarget: 34 },
      
      { id: 'basic-20', title: 'Grip Control', description: 'Flow control practice', text: 'Every stroke matters when typing quickly and maintaining accuracy.', difficulty: 'Intermediate', duration: '5 min', wpmTarget: 34 },
      
      { id: 'basic-21', title: 'Speed Drill', description: 'Speed-focused practice', text: 'push pull rush slide drift blaze spark sprint flash', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 35 },
      
      // ADVANCED
      
      { id: 'basic-22', title: 'Advanced Short 1', description: 'Fast, tough words', text: 'algorithm archive pattern texture fragment dynamic module', difficulty: 'Advanced', duration: '5 min', wpmTarget: 40 },
      
      { id: 'basic-23', title: 'Advanced Short 2', description: 'High-level vocabulary', text: 'precision elevation resonance simulation analytical visionary', difficulty: 'Advanced', duration: '5 min', wpmTarget: 41 },
      
      { id: 'basic-24', title: 'High-Speed Sentences', description: 'Longer short sentences', text: 'Fast reactions come from practice and the ability to stay focused while typing quickly.', difficulty: 'Advanced', duration: '5 min', wpmTarget: 42 },
      
      { id: 'basic-25', title: 'Sharp Reflex', description: 'Reflex-sharpening text', text: 'Typing requires instinctive control over finger movement and pattern recognition.', difficulty: 'Advanced', duration: '5 min', wpmTarget: 42 },
      
      { id: 'basic-26', title: 'Tech Short', description: 'Tech vocabulary burst', text: 'processor bandwidth protocol latency encryption architecture', difficulty: 'Advanced', duration: '5 min', wpmTarget: 41 },
      
      { id: 'basic-27', title: 'Ultra Short Story', description: 'Tiny high-speed story', text: 'The system flashed green as the final command executed flawlessly in seconds.', difficulty: 'Advanced', duration: '5 min', wpmTarget: 42 },
      
      { id: 'basic-28', title: 'Advanced Dialogue', description: 'Complex quick dialogue', text: '"Override now," he ordered. "Not yet," she insisted firmly.', difficulty: 'Advanced', duration: '4 min', wpmTarget: 41 },
      
      { id: 'basic-29', title: 'Symbol Surge', description: 'Expert symbol mix', text: '@data #logs $cost %value &core *sync ?', difficulty: 'Advanced', duration: '4 min', wpmTarget: 40 },
      
      { id: 'basic-30', title: 'Pressure Test', description: 'Quick high-pressure text', text: 'Sharp reaction time is the difference between fast and elite typing ability.', difficulty: 'Advanced', duration: '5 min', wpmTarget: 43 },
      
      { id: 'basic-31', title: 'Pro Burst', description: 'Quick expert warm-up', text: 'Mastery comes from energy, accuracy, focus, and relentless practice.', difficulty: 'Advanced', duration: '5 min', wpmTarget: 43 },
      { id: 'basic-32', title: 'Quick Reaction', description: 'Short reflex test', text: 'flip snap rush tap zip zoom clap drop spark flash', difficulty: 'Beginner', duration: '3 min', wpmTarget: 26 },

      { id: 'basic-33', title: 'Mini Flow 1', description: 'Tiny flowing sentences', text: 'Morning light spread softly across the quiet field.', difficulty: 'Beginner', duration: '3 min', wpmTarget: 27 },
      
      { id: 'basic-34', title: 'Mini Flow 2', description: 'Simple smooth flow', text: 'Calm winds moved gently through the tall trees.', difficulty: 'Beginner', duration: '3 min', wpmTarget: 28 },
      
      { id: 'basic-35', title: 'Direct Words', description: 'Short directional words', text: 'up down left right near far over under in out', difficulty: 'Beginner', duration: '3 min', wpmTarget: 26 },
      
      { id: 'basic-36', title: 'Quick Combo', description: 'Small combo words', text: 'jump sprint glide drift shift blink strike spark', difficulty: 'Beginner', duration: '3 min', wpmTarget: 27 },
      
      { id: 'basic-37', title: 'Short Sentences 3', description: 'Easy small sentences', text: 'The bike rolled away. A cloud hid the moon. I took a short walk.', difficulty: 'Beginner', duration: '4 min', wpmTarget: 27 },
      
      // INTERMEDIATE
      
      { id: 'basic-38', title: 'Rapid Mix 1', description: 'Medium difficulty words', text: 'gravity focus signal pulse orbit layer refine rapid', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 33 },
      
      { id: 'basic-39', title: 'Rapid Mix 2', description: 'Quick mixed vocabulary', text: 'texture pattern dynamic value shadow control blend', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 33 },
      
      { id: 'basic-40', title: 'Fast Short Story 1', description: 'Quick narrative burst', text: 'He ran toward the gate as the bell rang loudly behind him.', difficulty: 'Intermediate', duration: '5 min', wpmTarget: 34 },
      
      { id: 'basic-41', title: 'Fast Short Story 2', description: 'Brief dramatic scene', text: 'The clock struck twelve as the lights flickered across the hall.', difficulty: 'Intermediate', duration: '5 min', wpmTarget: 34 },
      
      { id: 'basic-42', title: 'Quick Precision', description: 'Accuracy under speed', text: 'Strong habits build precise movement and steady typing rhythm.', difficulty: 'Intermediate', duration: '5 min', wpmTarget: 35 },
      
      { id: 'basic-43', title: 'Punch Words', description: 'High-energy words', text: 'blast surge ignite strike launch speed charge flash', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 34 },
      
      { id: 'basic-44', title: 'Speed Sprints', description: 'Short speed bursts', text: 'fast faster fastest rapid rapidity rush hurry dash', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 34 },
      
      { id: 'basic-45', title: 'Dialogue Sprint', description: 'Fast dialogue typing', text: '"Move now!" he yelled. "I am ready," she answered.', difficulty: 'Intermediate', duration: '4 min', wpmTarget: 35 },
      
      // ADVANCED
      
      { id: 'basic-46', title: 'Advanced Pulse', description: 'Short technical terms', text: 'interface module protocol fragment matrix archive flux', difficulty: 'Advanced', duration: '5 min', wpmTarget: 41 },
      
      { id: 'basic-47', title: 'Quick Logic', description: 'Pattern and logic words', text: 'shift craft draft lift drift swift craft shift', difficulty: 'Advanced', duration: '5 min', wpmTarget: 40 },
      
      { id: 'basic-48', title: 'Pressure Burst 2', description: 'High-pressure speed', text: 'Every second counts when accuracy and speed merge together.', difficulty: 'Advanced', duration: '5 min', wpmTarget: 41 },
      
      { id: 'basic-49', title: 'Tech Sparks', description: 'Tech-focused micro text', text: 'binary storage system memory cycle cluster function', difficulty: 'Advanced', duration: '5 min', wpmTarget: 42 },
      
      { id: 'basic-50', title: 'Expert Short Burst', description: 'Expert-level short drill', text: 'Consistent training builds flawless precision under intense speed.', difficulty: 'Advanced', duration: '5 min', wpmTarget: 43 },
                
    ]
  },
  programming: {
    name: 'Programming',
    icon: Code,
    color: 'bg-indigo-500',
    description: 'Practice coding syntax',
    lessons: [
      { id: 'javascript-basics', title: 'JavaScript Basics', description: 'JavaScript syntax', text: 'function add(a, b) { return a + b; } const nums = [1, 2, 3];', difficulty: 'Intermediate', duration: '15 min', wpmTarget: 35 },
      { id: 'js-variables', title: 'JS Variables', description: 'Basic JavaScript variables', text: 'let count = 0;\nconst name = "Alice";\ncount += 1;', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },

      { id: 'js-loops', title: 'JS Loops', description: 'For and while loops', text: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\nwhile (x < 10) x++;', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'js-objects', title: 'JS Objects', description: 'Object practice', text: 'const user = { name: "Bob", age: 20, active: true };', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 33 },
      
      { id: 'js-array-methods', title: 'JS Array Methods', description: 'map, filter, reduce', text: 'const doubled = nums.map(n => n * 2);\nconst even = nums.filter(n => n % 2 === 0);', difficulty: 'Advanced', duration: '15 min', wpmTarget: 38 },
      
      { id: 'js-classes', title: 'JavaScript Classes', description: 'OOP basics in JS', text: 'class Car { constructor(model) { this.model = model; } drive() { return "vroom"; }}', difficulty: 'Advanced', duration: '15 min', wpmTarget: 40 },
      
      { id: 'python-basics', title: 'Python Basics', description: 'Simple Python syntax', text: 'def greet(name):\n    return f"Hello {name}"\nprint(greet("Sam"))', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'python-loops', title: 'Python Loops', description: 'For loop typing practice', text: 'for i in range(5):\n    print(i)', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'python-lists', title: 'Python Lists', description: 'List operations', text: 'numbers = [2, 4, 6]\nnumbers.append(8)\ntotal = sum(numbers)', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 33 },
      
      { id: 'python-class', title: 'Python Class', description: 'Object-oriented Python', text: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return "woof"', difficulty: 'Advanced', duration: '15 min', wpmTarget: 38 },
      
      { id: 'python-dict', title: 'Python Dictionary', description: 'Dict examples', text: 'user = {"name": "Ava", "score": 42}\nprint(user["score"])', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 33 },
      
      { id: 'cpp-basics', title: 'C++ Basics', description: 'Simple C++ syntax', text: '#include <iostream>\nint main() {\n  std::cout << "Hello";\n}', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 34 },
      
      { id: 'cpp-loop', title: 'C++ Loop', description: 'For loop in C++', text: 'for(int i = 0; i < 10; i++) {\n  std::cout << i;\n}', difficulty: 'Intermediate', duration: '13 min', wpmTarget: 35 },
      
      { id: 'cpp-class', title: 'C++ Class', description: 'Simple OOP in C++', text: 'class Box { public: int size; Box(int s): size(s) {} };', difficulty: 'Advanced', duration: '15 min', wpmTarget: 39 },
      
      { id: 'logic-operators', title: 'Logic Operators', description: 'Practice &&, ||, !', text: 'if (isReady && !isLoading) {\n  start();\n}', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 34 },
      
      { id: 'conditions-practice', title: 'Conditional Practice', description: 'If-else syntax typing', text: 'if (score > 50) {\n  status = "pass";\n} else {\n  status = "fail";\n}', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'function-drill', title: 'Function Drill', description: 'Typing functions quickly', text: 'function greet(n) {\n  return "Hello " + n;\n}', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 33 },
      
      { id: 'callback-practice', title: 'Callback Practice', description: 'Arrow functions + callback', text: 'setTimeout(() => {\n  console.log("Done");\n}, 1000);', difficulty: 'Advanced', duration: '15 min', wpmTarget: 38 },
      
      { id: 'async-await', title: 'Async & Await', description: 'Async syntax practice', text: 'async function load() {\n  const data = await fetch(url);\n}', difficulty: 'Advanced', duration: '15 min', wpmTarget: 40 },
      
      { id: 'json-practice', title: 'JSON Practice', description: 'JSON object typing', text: '{"name": "Liam", "score": 99, "active": true}', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 34 },
      
      { id: 'string-methods', title: 'String Methods', description: 'Common string operations', text: 'const msg = "hello";\nmsg.toUpperCase();\nmsg.includes("he");', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 34 },
      { id: 'prog-2', title: 'Variables & Constants', description: 'Basic JS variables', text: 'let x = 10; const y = 20; console.log(x + y);', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },

      { id: 'prog-3', title: 'If Conditions', description: 'Conditional statements', text: 'if (score > 50) { console.log("Pass"); } else { console.log("Fail"); }', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'prog-4', title: 'Loops Practice', description: 'For loop syntax', text: 'for (let i = 0; i < 5; i++) { console.log(i); }', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },
      
      { id: 'prog-5', title: 'While Loop', description: 'Practice while loops', text: 'while (count < 10) { count++; }', difficulty: 'Beginner', duration: '8 min', wpmTarget: 28 },
      
      { id: 'prog-6', title: 'Arrays Basics', description: 'Array operations', text: 'const fruits = ["apple", "mango", "banana"]; fruits.push("orange");', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'prog-7', title: 'Object Practice', description: 'JavaScript objects', text: 'const user = { name: "Alex", age: 20 }; console.log(user.name);', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'prog-8', title: 'Functions Practice', description: 'Function declaration', text: 'function greet(name) { return "Hello " + name; }', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 34 },
      
      { id: 'prog-9', title: 'Arrow Functions', description: 'ES6 arrow syntax', text: 'const add = (a, b) => a + b;', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },
      
      { id: 'prog-10', title: 'Map Method', description: 'Array map()', text: 'const doubled = nums.map(n => n * 2);', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 35 },
      
      { id: 'prog-11', title: 'Filter Method', description: 'Array filter()', text: 'const even = nums.filter(n => n % 2 === 0);', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 35 },
      
      { id: 'prog-12', title: 'Reduce Method', description: 'Array reduce()', text: 'const sum = nums.reduce((a, b) => a + b, 0);', difficulty: 'Advanced', duration: '15 min', wpmTarget: 40 },
      
      { id: 'prog-13', title: 'String Methods', description: 'Basic string usage', text: 'const msg = "hello"; console.log(msg.toUpperCase());', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'prog-14', title: 'Template Literals', description: 'String templates', text: 'const text = `User: ${user.name}`;', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 33 },
      
      { id: 'prog-15', title: 'Promises Basics', description: 'Async promise', text: 'new Promise(resolve => resolve("done"));', difficulty: 'Advanced', duration: '15 min', wpmTarget: 40 },
      
      { id: 'prog-16', title: 'Async Await', description: 'Async functions', text: 'async function load() { const data = await fetch(url); }', difficulty: 'Advanced', duration: '15 min', wpmTarget: 40 },
      
      { id: 'prog-17', title: 'Try Catch Block', description: 'Error handling', text: 'try { run(); } catch (err) { console.log(err); }', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'prog-18', title: 'Class Basics', description: 'OOP class syntax', text: 'class User { constructor(n) { this.name = n; } }', difficulty: 'Advanced', duration: '15 min', wpmTarget: 38 },
      
      { id: 'prog-19', title: 'Objects & Methods', description: 'Object method practice', text: 'const car = { start() { return "ON"; } };', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'prog-20', title: 'JSON Handling', description: 'Working with JSON', text: 'const data = JSON.parse(jsonText);', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 34 },
      
      { id: 'prog-21', title: 'DOM Basics', description: 'Simple DOM code', text: 'document.getElementById("box").innerText = "Hello";', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'prog-22', title: 'Events Practice', description: 'Click event example', text: 'button.addEventListener("click", () => alert("Hi"));', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 33 },
      
      { id: 'prog-23', title: 'Set Timeout', description: 'Timeout code', text: 'setTimeout(() => console.log("done"), 1000);', difficulty: 'Beginner', duration: '8 min', wpmTarget: 28 },
      
      { id: 'prog-24', title: 'Set Interval', description: 'Interval code', text: 'setInterval(() => console.log("tick"), 500);', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 32 },
      
      { id: 'prog-25', title: 'Modules Import', description: 'ES6 import example', text: 'import add from "./math.js";', difficulty: 'Advanced', duration: '12 min', wpmTarget: 38 },
      
      { id: 'prog-26', title: 'Export Example', description: 'ES6 module export', text: 'export function greet() { return "Hello"; }', difficulty: 'Advanced', duration: '12 min', wpmTarget: 38 },
      
      { id: 'prog-27', title: 'Constructor Function', description: 'Older JS OOP', text: 'function Person(n) { this.name = n; }', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 33 },
      
      { id: 'prog-28', title: 'Spread Operator', description: 'ES6 spread', text: 'const newArr = [...arr, 5, 6];', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 33 },
      
      { id: 'prog-29', title: 'Destructuring', description: 'Object & array destructuring', text: 'const { name, age } = user;', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 33 },
      
      { id: 'prog-30', title: 'Fetch API', description: 'Basic fetch usage', text: 'fetch(url).then(res => res.json());', difficulty: 'Advanced', duration: '15 min', wpmTarget: 40 },
      
      { id: 'prog-31', title: 'LocalStorage', description: 'Saving data locally', text: 'localStorage.setItem("score", 100);', difficulty: 'Beginner', duration: '8 min', wpmTarget: 28 },
            
    ]
  },
  poems: {
    name: 'Poems',
    icon: BookOpen,
    color: 'bg-purple-500',
    description: 'Short poetic lines',
    lessons: [
      {
        id: 'poem-1',
        title: 'Dawn Light',
        text: 'The morning sun drifts softly across the silent hills.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 20
      },
      {
        id: 'poem-2',
        title: 'Moon Whisper',
        text: 'The moon whispers gently to the quiet ocean below.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 20
      },
      {
        id: 'poem-3',
        title: 'Falling Leaves',
        text: 'Golden leaves swirl softly as the autumn wind sighs.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 20
      },
      {
        id: 'poem-4',
        title: 'Rain Notes',
        text: 'Raindrops tap lightly on the window like tiny melodies.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 22
      },
      {
        id: 'poem-5',
        title: 'Quiet River',
        text: 'A gentle river glides through the valley with peaceful grace.',
        difficulty: 'Beginner',
        duration: '6 min',
        wpmTarget: 22
      },
      {
        id: 'poem-6',
        title: 'Starlit Sky',
        text: 'Stars shimmer softly across the wide and endless night.',
        difficulty: 'Beginner',
        duration: '6 min',
        wpmTarget: 22
      },
      {
        id: 'poem-7',
        title: 'Soft Breeze',
        text: 'A tender breeze carries the scent of distant dreams.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 21
      },
      {
        id: 'poem-8',
        title: 'Forest Echo',
        text: 'In the deep forest, whispers of life echo between the trees.',
        difficulty: 'Beginner',
        duration: '6 min',
        wpmTarget: 22
      },
      {
        id: 'poem-9',
        title: 'Calm Night',
        text: 'Night drapes the world in silence and gentle silver light.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 21
      },
      {
        id: 'poem-10',
        title: 'Waves',
        text: 'Soft waves rise and fall like the breath of the sea.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 20
      },
      {
        id: 'poem-11',
        title: 'Blossom Path',
        text: 'Cherry blossoms drift quietly along the old wooden path.',
        difficulty: 'Beginner',
        duration: '6 min',
        wpmTarget: 22
      },
      {
        id: 'poem-12',
        title: 'Golden Horizon',
        text: 'The horizon glows gently as the day prepares to rest.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 21
      },
      {
        id: 'poem-13',
        title: 'Silent Garden',
        text: 'In the silent garden, flowers listen to the evening air.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 21
      },
      {
        id: 'poem-14',
        title: 'Winter Glow',
        text: 'Snowflakes drift slowly through the soft winter glow.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 20
      },
      {
        id: 'poem-15',
        title: 'Bright Petals',
        text: 'Petals flutter like tiny wings beneath the gentle sun.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 21
      },
      {
        id: 'poem-16',
        title: 'Evening Wind',
        text: 'The evening wind hums softly across the quiet earth.',
        difficulty: 'Beginner',
        duration: '6 min',
        wpmTarget: 22
      },
      {
        id: 'poem-17',
        title: 'Lake Mist',
        text: 'Misty breaths rise slowly from the cold morning lake.',
        difficulty: 'Beginner',
        duration: '6 min',
        wpmTarget: 21
      },
      {
        id: 'poem-18',
        title: 'Shadow Dance',
        text: 'Shadows dance lightly beneath the warm glow of lanterns.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 20
      },
      {
        id: 'poem-19',
        title: 'Sunset Path',
        text: 'A lone path glows softly beneath the fading sunset sky.',
        difficulty: 'Beginner',
        duration: '6 min',
        wpmTarget: 22
      },
      {
        id: 'poem-20',
        title: 'Morning Dew',
        text: 'Morning dew rests gently on the quiet blades of grass.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 20
      },
      {
        id: 'poem-21',
        title: 'Cloud Drift',
        text: 'Clouds drift slowly across the soft blue afternoon sky.',
        difficulty: 'Beginner',
        duration: '5 min',
        wpmTarget: 21
      },
{
  id: 'poem-22',
  title: 'Silver Night',
  text: 'Moonlight drifts across the quiet rooftops like soft silver dust.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-23',
  title: 'Rhyme Breeze',
  text: 'Soft winds fly by, under the sky, carrying dreams that drift and sigh.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 21
},
{
  id: 'poem-24',
  title: 'Forest Heart',
  text: 'Deep in the forest sits the heart of quiet life, beating slowly with peace.',
  difficulty: 'Intermediate',
  duration: '6 min',
  wpmTarget: 24
},
{
  id: 'poem-25',
  title: 'Golden Steps',
  text: 'Every small step shines golden when the sun of hope rests behind it.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 21
},
{
  id: 'poem-26',
  title: 'Dream Path',
  text: 'A path of dreams winds softly through the silent morning haze.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-27',
  title: 'Dust of Stars',
  text: 'We walk beneath skies painted with dust from ancient stars.',
  difficulty: 'Intermediate',
  duration: '6 min',
  wpmTarget: 24
},
{
  id: 'poem-28',
  title: 'Rise Again',
  text: 'No matter the storm, the sun returns to rise again with gentle strength.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 22
},
{
  id: 'poem-29',
  title: 'Ocean Song',
  text: 'The ocean hums a song older than time and softer than memory.',
  difficulty: 'Beginner',
  duration: '6 min',
  wpmTarget: 22
},
{
  id: 'poem-30',
  title: 'Lantern Glow',
  text: 'Lanterns glow warmly along the quiet streets of evening.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-31',
  title: 'Whispering Pines',
  text: 'The pines whisper stories carried by the wandering wind.',
  difficulty: 'Beginner',
  duration: '6 min',
  wpmTarget: 21
},
{
  id: 'poem-32',
  title: 'Starlit Poem',
  text: 'Every star writes a tiny poem across the open night.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 21
},
{
  id: 'poem-33',
  title: 'River of Time',
  text: 'Time flows like a river, steady and calm, shaping gentle futures.',
  difficulty: 'Intermediate',
  duration: '6 min',
  wpmTarget: 24
},
{
  id: 'poem-34',
  title: 'Rising Petals',
  text: 'Bright petals rise softly in the warm hush of early spring.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-35',
  title: 'Soft Echoes',
  text: 'Echoes drift lightly through the valley, carrying forgotten songs.',
  difficulty: 'Beginner',
  duration: '6 min',
  wpmTarget: 21
},
{
  id: 'poem-36',
  title: 'Bright Horizon',
  text: 'A bright horizon paints the world with gentle promise and hope.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 22
},
{
  id: 'poem-37',
  title: 'Shadow Path',
  text: 'Shadows slip quietly along the narrow path of twilight.',
  difficulty: 'Beginner',
  duration: '6 min',
  wpmTarget: 21
},
{
  id: 'poem-38',
  title: 'Firefly Field',
  text: 'Fireflies drift like tiny dreams across the open summer field.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-39',
  title: 'Mountain Air',
  text: 'Fresh mountain air rolls softly down the quiet ridges.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 21
},
{
  id: 'poem-40',
  title: 'Calm Within',
  text: 'Peace rests quietly within us, waiting to be heard.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-41',
  title: 'Rhyme Waves',
  text: 'Waves rise and fall, gently they call, singing to all.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-42',
  title: 'Snowlight',
  text: 'Snowlight glimmers softly across the sleeping fields.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 21
},
{
  id: 'poem-43',
  title: 'Quiet Roads',
  text: 'Quiet roads stretch far into the soft glow of dawn.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-44',
  title: 'Whisper of Spring',
  text: 'Spring whispers gently with the scent of blooming life.',
  difficulty: 'Beginner',
  duration: '6 min',
  wpmTarget: 22
},
{
  id: 'poem-45',
  title: 'Evening Bells',
  text: 'Evening bells ring softly across the peaceful town.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 21
},
{
  id: 'poem-46',
  title: 'Golden Rain',
  text: 'Sunlight falls like golden rain across the open fields.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 21
},
{
  id: 'poem-47',
  title: 'The Quiet Sea',
  text: 'The sea rests quietly, breathing slow waves of calm.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-48',
  title: 'Feather Drift',
  text: 'A feather drifts gently through the still morning air.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
},
{
  id: 'poem-49',
  title: 'Sunbeam Song',
  text: 'A soft sunbeam sings through the window with warm delight.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 21
},
{
  id: 'poem-50',
  title: 'Twilight Dance',
  text: 'Twilight dances lightly across the quiet evening sky.',
  difficulty: 'Beginner',
  duration: '6 min',
  wpmTarget: 22
},
{
  id: 'poem-51',
  title: 'Calm Dreams',
  text: 'Dreams rest calmly beyond the soft curtain of sleep.',
  difficulty: 'Beginner',
  duration: '5 min',
  wpmTarget: 20
}
      
    ]
  },
  business: {
    name: 'Business',
    icon: ArrowLeft,
    color: 'bg-orange-500',
    description: 'Business-related writing',
    lessons: [
      { id: 'biz-1', title: 'Business Emails 1', description: 'Professional email', text: 'Dear Mr. Johnson, I hope you are doing well. I am writing to inform you about the upcoming meeting scheduled for Monday.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 30 },
      { id: 'biz-2', title: 'Business Emails 2', description: 'Follow-up email', text: 'Dear Team, I am following up regarding the proposal shared last week. Kindly let me know if any updates are required.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 30 },

      { id: 'biz-3', title: 'Meeting Agenda', description: 'Agenda writing', text: 'Agenda: Project updates, budget review, timeline adjustments, department feedback, and next steps.', difficulty: 'Intermediate', duration: '8 min', wpmTarget: 30 },
      
      { id: 'biz-4', title: 'Professional Request', description: 'Formal request', text: 'I would like to request approval for the new software tools required to finalize the quarterly analysis.', difficulty: 'Intermediate', duration: '9 min', wpmTarget: 30 },
      
      { id: 'biz-5', title: 'Client Introduction', description: 'Client communication', text: 'Hello, It is great connecting with you. I look forward to discussing collaboration opportunities.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 32 },
      
      { id: 'biz-6', title: 'Status Update', description: 'Project update', text: 'The project is progressing on schedule. All major tasks have been completed as per the timeline.', difficulty: 'Intermediate', duration: '7 min', wpmTarget: 30 },
      
      { id: 'biz-7', title: 'Feedback Response', description: 'Replying to feedback', text: 'Thank you for sharing your suggestions. We will review them and make improvements as needed.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-8', title: 'Internal Announcement', description: 'Team message', text: 'Please note that the monthly review meeting will be held on Thursday at 11 AM.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-9', title: 'Project Summary', description: 'Short summary', text: 'This project aims to improve customer satisfaction by reducing response times and enhancing service quality.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 32 },
      
      { id: 'biz-10', title: 'Partnership Offer', description: 'Business outreach', text: 'We are exploring opportunities for collaboration and would like to discuss potential partnership areas.', difficulty: 'Intermediate', duration: '9 min', wpmTarget: 32 },
      
      { id: 'biz-11', title: 'Office Memo', description: 'Memo writing', text: 'Please be informed that the office will be closed on Friday due to scheduled maintenance.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-12', title: 'Proposal Opening', description: 'Proposal introduction', text: 'This proposal outlines a structured plan designed to improve workflow efficiency across all departments.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },
      
      { id: 'biz-13', title: 'Customer Service Reply', description: 'Customer support writing', text: 'Thank you for contacting us. Our team is reviewing your request and will respond shortly.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-14', title: 'Sales Pitch', description: 'Sales communication', text: 'Our product offers a fast and reliable solution that enhances productivity and streamlines operations.', difficulty: 'Intermediate', duration: '8 min', wpmTarget: 32 },
      
      { id: 'biz-15', title: 'Team Reminder', description: 'Reminder message', text: 'This is a reminder to submit your progress updates before the weekly review meeting.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-16', title: 'Deadline Reminder', description: 'Deadline communication', text: 'Please ensure that all pending reports are submitted by end of day today.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-17', title: 'Short Report', description: 'Business reporting', text: 'The latest market trends show an increase in demand for digital transformation solutions.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 34 },
      
      { id: 'biz-18', title: 'Policy Update', description: 'Policy communication', text: 'Starting next week, all employees must complete the updated data security training module.', difficulty: 'Intermediate', duration: '7 min', wpmTarget: 30 },
      
      { id: 'biz-19', title: 'Thank You Note', description: 'Formal appreciation', text: 'Thank you for attending the session today. Your insights were helpful and appreciated.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-20', title: 'Invoice Email', description: 'Billing communication', text: 'Please find attached the invoice for this month. Kindly review and process the payment at your earliest convenience.', difficulty: 'Intermediate', duration: '8 min', wpmTarget: 30 },
      
      { id: 'biz-21', title: 'Corporate Greeting', description: 'Seasonal greeting', text: 'Wishing you a productive month ahead. Thank you for your continued support and dedication.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-22', title: 'Employee Welcome', description: 'Welcome message', text: 'Welcome to our team! We are excited to have you on board and look forward to working together.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-23', title: 'Training Invite', description: 'Training communication', text: 'You are invited to attend the communication skills workshop scheduled for Wednesday at 3 PM.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-24', title: 'Vendor Coordination', description: 'Vendor communication', text: 'We would like to confirm the delivery schedule for this month and request updated shipment details.', difficulty: 'Intermediate', duration: '8 min', wpmTarget: 32 },
      
      { id: 'biz-25', title: 'Budget Update', description: 'Corporate finance', text: 'The revised budget reflects increased investment in digital tools and reduced operational expenses.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },
      
      { id: 'biz-26', title: 'Event Notes', description: 'Event planning', text: 'We are preparing for the annual corporate event and will share the full schedule soon.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-27', title: 'Service Inquiry', description: 'Inquiry email', text: 'Could you please share more details about the enterprise plan and available support features?', difficulty: 'Intermediate', duration: '7 min', wpmTarget: 30 },
      
      { id: 'biz-28', title: 'Policy Reminder', description: 'Work policy', text: 'Employees are requested to review and follow the updated remote work guidelines effective immediately.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-29', title: 'Goal Communication', description: 'Goal setting', text: 'Our primary goal this quarter is to enhance customer satisfaction through faster service delivery.', difficulty: 'Intermediate', duration: '9 min', wpmTarget: 32 },
      
      { id: 'biz-30', title: 'Team Motivation', description: 'Motivational note', text: 'Let’s continue working together with focus and dedication to achieve our targets for the quarter.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-31', title: 'Apology Email', description: 'Professional apology', text: 'We apologize for the delay in our response. Our team is reviewing your request and will update you soon.', difficulty: 'Intermediate', duration: '7 min', wpmTarget: 30 },
      { id: 'biz-32', title: 'Project Delay Notice', description: 'Informing about delays', text: 'We would like to inform you that the project timeline has been extended due to unforeseen challenges. Updated schedules will be shared soon.', difficulty: 'Intermediate', duration: '8 min', wpmTarget: 30 },

      { id: 'biz-33', title: 'Internal Survey Email', description: 'Survey request', text: 'Please take a moment to complete the employee satisfaction survey. Your feedback is valuable to us.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-34', title: 'Hiring Update', description: 'Recruitment communication', text: 'We have received your application and will review it shortly. Our HR team will contact you for the next steps.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-35', title: 'Resource Request', description: 'Asking for resources', text: 'Kindly provide access to the updated budget sheets so that we can finalize the financial report.', difficulty: 'Intermediate', duration: '7 min', wpmTarget: 30 },
      
      { id: 'biz-36', title: 'Document Submission', description: 'Submission reminder', text: 'Please submit all required documents by Friday to ensure timely processing of your request.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-37', title: 'Meeting Summary', description: 'Short meeting recap', text: 'Today’s meeting covered performance updates, upcoming deadlines, and future project planning.', difficulty: 'Intermediate', duration: '8 min', wpmTarget: 30 },
      
      { id: 'biz-38', title: 'Invitation Email', description: 'Formal invitation', text: 'You are invited to join the quarterly strategy meeting scheduled for next Tuesday at 10 AM.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-39', title: 'Quarterly Results', description: 'Corporate results summary', text: 'The quarterly results show consistent growth in key performance areas, including customer engagement and product adoption.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },
      
      { id: 'biz-40', title: 'Work Assignment', description: 'Task assignment', text: 'Please review the attached document and prepare a brief summary for the next team meeting.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'biz-41', title: 'Performance Appreciation', description: 'Appreciating good work', text: 'Great job on completing the project ahead of schedule. Your effort is sincerely appreciated.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-42', title: 'New Policy Introduction', description: 'Policy announcement', text: 'We are introducing a new attendance policy starting next month. Please review the attached document carefully.', difficulty: 'Intermediate', duration: '8 min', wpmTarget: 30 },
      
      { id: 'biz-43', title: 'Resource Allocation', description: 'Planning resources', text: 'We are reallocating team members to ensure better productivity and balanced workload distribution.', difficulty: 'Intermediate', duration: '9 min', wpmTarget: 32 },
      
      { id: 'biz-44', title: 'Meeting Confirmation', description: 'Confirming meeting details', text: 'This email confirms our meeting tomorrow at 2 PM to discuss the marketing strategy.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-45', title: 'Corporate Update', description: 'Company-wide update', text: 'We are pleased to announce that our company has achieved significant milestones this quarter.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 34 },
      
      { id: 'biz-46', title: 'Schedule Adjustment', description: 'Changing schedules', text: 'Please note that the review session has been rescheduled to Friday due to team availability.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-47', title: 'Formal Warning', description: 'Policy violation warning', text: 'This is an official reminder to adhere to the company guidelines. Please ensure compliance moving forward.', difficulty: 'Intermediate', duration: '8 min', wpmTarget: 30 },
      
      { id: 'biz-48', title: 'Invoice Follow-Up', description: 'Payment follow-up', text: 'This is a gentle reminder regarding the pending invoice. Kindly process it at the earliest.', difficulty: 'Intermediate', duration: '7 min', wpmTarget: 30 },
      
      { id: 'biz-49', title: 'Team Coordination', description: 'Team planning message', text: 'Please update your task progress by evening so we can plan the next sprint effectively.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'biz-50', title: 'CSR Announcement', description: 'Corporate social responsibility', text: 'We are launching a new community service program and encourage all employees to participate.', difficulty: 'Intermediate', duration: '9 min', wpmTarget: 32 },
      
      { id: 'biz-51', title: 'Weekly Newsletter', description: 'Short internal newsletter', text: 'This week’s highlights include project achievements, training schedules, and team performance updates.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 }
            
    ]
  },
  quotes: {
    name: 'Inspirational Quotes',
    icon: Star,
    color: 'bg-yellow-500',
    description: 'Motivational and famous quotes',
    lessons: [
      { id: 'quote-1', title: 'Steve Jobs Quote', description: 'Famous innovation quote', text: 'The only way to do great work is to love what you do.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      { id: 'quote-2', title: 'Albert Einstein', description: 'Quote about imagination', text: 'Imagination is more important than knowledge.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },

      { id: 'quote-3', title: 'Nelson Mandela', description: 'Quote about courage', text: 'It always seems impossible until it is done.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-4', title: 'Walt Disney', description: 'Quote about dreams', text: 'All our dreams can come true if we have the courage to pursue them.', difficulty: 'Beginner', duration: '6 min', wpmTarget: 25 },
      
      { id: 'quote-5', title: 'Mahatma Gandhi', description: 'Quote about change', text: 'Be the change that you wish to see in the world.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-6', title: 'Confucius', description: 'Quote about perseverance', text: 'It does not matter how slowly you go as long as you do not stop.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-7', title: 'Helen Keller', description: 'Quote about optimism', text: 'Keep your face to the sunshine and you cannot see a shadow.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-8', title: 'Martin Luther King Jr.', description: 'Quote about hope', text: 'Only in the darkness can you see the stars.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-9', title: 'Henry Ford', description: 'Quote about belief', text: 'Whether you think you can or think you can’t, you’re right.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-10', title: 'Lao Tzu', description: 'Quote about beginnings', text: 'The journey of a thousand miles begins with one step.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-11', title: 'Aristotle', description: 'Quote about excellence', text: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-12', title: 'Mother Teresa', description: 'Quote about kindness', text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-13', title: 'Bruce Lee', description: 'Quote about growth', text: 'Absorb what is useful, discard what is not, add what is uniquely your own.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-14', title: 'Ralph Waldo Emerson', description: 'Quote about courage', text: 'Do not go where the path may lead. Go instead where there is no path and leave a trail.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-15', title: 'Marcus Aurelius', description: 'Quote about mindset', text: 'You have power over your mind, not outside events. Realize this, and you will find strength.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-16', title: 'Oscar Wilde', description: 'Quote about being yourself', text: 'Be yourself; everyone else is already taken.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-17', title: 'Theodore Roosevelt', description: 'Quote about effort', text: 'Believe you can and you’re halfway there.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-18', title: 'Jim Rohn', description: 'Quote about discipline', text: 'Discipline is the bridge between goals and accomplishment.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-19', title: 'C.S. Lewis', description: 'Quote about progress', text: 'There are far better things ahead than any we leave behind.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-20', title: 'Vincent van Gogh', description: 'Quote about courage', text: 'What would life be if we had no courage to attempt anything?', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-21', title: 'Bill Gates', description: 'Quote about learning', text: 'It’s fine to celebrate success, but it is more important to heed the lessons of failure.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-22', title: 'J.K. Rowling', description: 'Quote about determination', text: 'Rock bottom became the solid foundation on which I rebuilt my life.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-23', title: 'Muhammad Ali', description: 'Quote about belief', text: 'If my mind can conceive it and my heart can believe it, then I can achieve it.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-24', title: 'Tony Robbins', description: 'Quote about decisions', text: 'It is in your moments of decision that your destiny is shaped.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-25', title: 'Eleanor Roosevelt', description: 'Quote about fear', text: 'Do one thing every day that scares you.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-26', title: 'Napoleon Hill', description: 'Quote about vision', text: 'Whatever the mind can conceive and believe, it can achieve.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-27', title: 'Shakespeare', description: 'Quote about greatness', text: 'Some are born great, some achieve greatness, and some have greatness thrust upon them.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-28', title: 'Charles Dickens', description: 'Quote about purpose', text: 'No one is useless in this world who lightens the burden of another.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-29', title: 'Plato', description: 'Quote about wisdom', text: 'The beginning is the most important part of the work.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-30', title: 'Socrates', description: 'Quote about knowledge', text: 'The only true wisdom is in knowing you know nothing.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-31', title: 'Sun Tzu', description: 'Quote about strategy', text: 'In the midst of chaos, there is also opportunity.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      { id: 'quote-2', title: 'Nelson Mandela', description: 'Perseverance', text: 'It always seems impossible until it is done.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },

      { id: 'quote-3', title: 'Albert Einstein', description: 'Imagination and knowledge', text: 'Imagination is more important than knowledge.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-4', title: 'Mahatma Gandhi', description: 'Change', text: 'Be the change that you wish to see in the world.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-5', title: 'Confucius', description: 'Consistency', text: 'It does not matter how slowly you go as long as you do not stop.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-6', title: 'Walt Disney', description: 'Dreams', text: 'All our dreams can come true if we have the courage to pursue them.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-7', title: 'Martin Luther King Jr.', description: 'Faith', text: 'Faith is taking the first step even when you don’t see the whole staircase.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 28 },
      
      { id: 'quote-8', title: 'Oscar Wilde', description: 'Individuality', text: 'Be yourself; everyone else is already taken.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-9', title: 'Mother Teresa', description: 'Kindness', text: 'Spread love everywhere you go.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 22 },
      
      { id: 'quote-10', title: 'Aristotle', description: 'Excellence', text: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-11', title: 'Bruce Lee', description: 'Growth', text: 'Absorb what is useful, discard what is not, add what is uniquely your own.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-12', title: 'Helen Keller', description: 'Vision', text: 'The only thing worse than being blind is having sight but no vision.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-13', title: 'Lao Tzu', description: 'Beginnings', text: 'The journey of a thousand miles begins with one step.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-14', title: 'Henry Ford', description: 'Belief', text: 'Whether you think you can or you think you can’t, you’re right.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-15', title: 'Rumi', description: 'Motivation', text: 'What you seek is seeking you.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-16', title: 'Mark Twain', description: 'Courage', text: 'Courage is resistance to fear, mastery of fear, not absence of fear.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-17', title: 'Vince Lombardi', description: 'Determination', text: 'Winners never quit and quitters never win.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-18', title: 'Eleanor Roosevelt', description: 'Confidence', text: 'No one can make you feel inferior without your consent.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
      
      { id: 'quote-19', title: 'Jim Rohn', description: 'Discipline', text: 'Discipline is the bridge between goals and accomplishment.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-20', title: 'Tony Robbins', description: 'Action', text: 'The path to success is to take massive, determined action.', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 30 },
      
      { id: 'quote-21', title: 'Leonardo da Vinci', description: 'Learning', text: 'Learning never exhausts the mind.', difficulty: 'Beginner', duration: '5 min', wpmTarget: 25 },
            
    ]
  },
  sports: {
    name: 'Sports',
    icon: Flame,
    color: 'bg-red-500',
    description: 'Sports-related content',
    lessons: [
      { id: 'sports-2', title: 'Football Match Report', description: 'Post-match analysis', text: 'The striker delivered a stunning goal in the final minutes, securing a decisive victory.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-3', title: 'Cricket Highlights', description: 'Match summary', text: 'The opening batsman scored a remarkable century, guiding the team to a competitive total.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-4', title: 'Basketball Play Review', description: 'Breakdown of gameplay', text: 'The point guard executed a flawless pick-and-roll, creating an easy scoring opportunity.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-5', title: 'Tennis Rally Analysis', description: 'Commentary', text: 'Both players exchanged powerful groundstrokes, showcasing exceptional footwork and precision.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-6', title: 'Athlete Spotlight', description: 'Player biography', text: 'The athlete’s dedication, discipline, and relentless practice earned them global admiration.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-7', title: 'Running Event Recap', description: 'Race details', text: 'The marathon runner maintained a steady pace, finishing with an impressive personal best.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-8', title: 'Swimming Championship', description: 'Event summary', text: 'The swimmer dominated the pool with powerful strokes and flawless turns.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-9', title: 'Hockey Match Update', description: 'Match overview', text: 'The rivalry intensified as both teams displayed incredible teamwork and aggression.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-10', title: 'Volleyball Rally', description: 'Action recap', text: 'The team executed perfect coordination, delivering a quick spike that stunned their opponents.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-11', title: 'Badminton Final', description: 'Match description', text: 'The intense rally showcased agility, quick reflexes, and masterful shuttle control.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-12', title: 'Boxing Bout Recap', description: 'Fight commentary', text: 'Both fighters demonstrated immense stamina, trading powerful punches throughout the rounds.', difficulty: 'Advanced', duration: '12 min', wpmTarget: 40 },

{ id: 'sports-13', title: 'Formula Racing', description: 'Race summary', text: 'The driver skillfully maneuvered through tight corners, maintaining top speed on straights.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-14', title: 'Cycling Tour Update', description: 'Stage highlights', text: 'Riders battled steep climbs and sharp descents, pushing their endurance to the limit.', difficulty: 'Advanced', duration: '12 min', wpmTarget: 40 },

{ id: 'sports-15', title: 'Gymnastics Routine', description: 'Performance details', text: 'The gymnast displayed exceptional balance and control during the flawless routine.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-16', title: 'Wrestling Match', description: 'Match analysis', text: 'The wrestlers showcased tactical strength, executing quick takedowns and counters.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-17', title: 'Table Tennis Rally', description: 'Fast-paced action', text: 'The rapid-fire rally demonstrated lightning-fast reflexes from both players.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-18', title: 'Golf Tournament', description: 'Tournament review', text: 'The golfer maintained steady composure, sinking difficult putts with precision.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-19', title: 'Kabaddi Clash', description: 'Match highlight', text: 'Raiders and defenders fought fiercely, using strategy and speed to dominate.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-20', title: 'Rugby Breakdown', description: 'Match analysis', text: 'The match was physical and intense, with both teams delivering powerful tackles.', difficulty: 'Advanced', duration: '12 min', wpmTarget: 40 },

{ id: 'sports-21', title: 'Athletic Training', description: 'Training insights', text: 'Athletes undergo rigorous routines focusing on speed, stamina, and discipline.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-22', title: 'Esports Tournament', description: 'Gaming competition highlight', text: 'Players displayed lightning-fast decision-making and impeccable teamwork.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-23', title: 'Sports Motivation', description: 'Mental strength', text: 'Champions are built through resilience, persistence, and an unbreakable mindset.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-24', title: 'Team Strategy', description: 'Sports tactics', text: 'Coaches developed strategic formations that maximized team efficiency.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-25', title: 'Match Commentary 2', description: 'Live commentary style', text: 'The pace picked up as players pushed hard to gain control in the final minutes.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-26', title: 'Race Day', description: 'Running event', text: 'Runners surged forward as the starting whistle blew through the stadium.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-27', title: 'Sports History', description: 'Historical overview', text: 'Sports traditions have evolved over centuries, shaping cultures worldwide.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-28', title: 'Coaching Lesson', description: 'Training advice', text: 'Coaches emphasize discipline, routine, and focus to develop great athletes.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-29', title: 'Victory Speech', description: 'Post-win statement', text: 'The captain thanked teammates, fans, and coaches for their relentless support.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-30', title: 'Stadium Atmosphere', description: 'Crowd energy', text: 'Fans roared with excitement as the final whistle signaled a thrilling finish.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-31', title: 'Player Interview', description: 'Athlete thoughts', text: 'The player discussed preparation, strategy, and staying mentally strong.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },
{ id: 'sports-32', title: 'Marathon Challenge', description: 'Long-distance running', text: 'Runners endured grueling miles, testing stamina and mental endurance.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-33', title: 'Soccer Drills', description: 'Training session', text: 'Players practiced passing, dribbling, and shooting to sharpen their skills.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-34', title: 'Basketball Finals', description: 'Game highlight', text: 'The final buzzer saw a dramatic three-pointer that secured the championship.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-35', title: 'Tennis Tournament', description: 'Match analysis', text: 'Both players showcased precision and stamina, exchanging intense rallies.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-36', title: 'Olympic Swimming', description: 'Event coverage', text: 'Swimmers powered through laps, breaking personal and world records.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-37', title: 'Cricket Strategy', description: 'Game planning', text: 'Captains discussed field placement and batting order to optimize performance.', difficulty: 'Advanced', duration: '12 min', wpmTarget: 40 },

{ id: 'sports-38', title: 'Volleyball Playoff', description: 'Match summary', text: 'Quick spikes and strategic serves determined the outcome of the match.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-39', title: 'Track and Field', description: 'Event overview', text: 'Athletes competed in sprints, hurdles, and jumps showcasing agility and speed.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-40', title: 'Gymnastics Performance', description: 'Routine recap', text: 'Flawless flips and balance moves captivated the judges and audience alike.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-41', title: 'Football Tactics', description: 'Team strategy', text: 'Defenders and midfielders coordinated to maintain possession and control the pace.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-42', title: 'Basketball Training', description: 'Skill session', text: 'Players worked on layups, free throws, and defensive drills to improve overall performance.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-43', title: 'Cricket Commentary', description: 'Match narration', text: 'The bowler delivered a perfect yorker, leaving the batsman unable to react.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-44', title: 'Swimming Technique', description: 'Stroke training', text: 'Swimmers refined freestyle and butterfly techniques for improved speed.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-45', title: 'Rugby Play', description: 'Game recap', text: 'The team executed coordinated passes and tackles, keeping possession under pressure.', difficulty: 'Advanced', duration: '12 min', wpmTarget: 40 },

{ id: 'sports-46', title: 'Tennis Practice', description: 'Training drills', text: 'Players focused on serve accuracy and volley consistency during training.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-47', title: 'Boxing Round', description: 'Fight highlight', text: 'Boxers exchanged jabs and hooks, demonstrating speed, defense, and stamina.', difficulty: 'Advanced', duration: '12 min', wpmTarget: 40 },

{ id: 'sports-48', title: 'Athletics Meet', description: 'Event summary', text: 'Sprinters and jumpers competed for medals, demonstrating peak athletic form.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-49', title: 'Esports Championship', description: 'Gaming competition', text: 'Teams displayed lightning-fast reflexes and strategic coordination to win.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-50', title: 'Table Tennis Rally', description: 'Action recap', text: 'Players exchanged rapid shots, testing precision and reaction speed.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-51', title: 'Cycling Race', description: 'Race coverage', text: 'Cyclists tackled hills and sprints, maintaining pace and endurance throughout.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-52', title: 'Football Highlights', description: 'Match summary', text: 'A stunning goal in the final minutes turned the game in favor of the home team.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-53', title: 'Basketball Slam Dunk', description: 'Exciting moment', text: 'The player soared past defenders for an impressive slam dunk, electrifying the crowd.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-54', title: 'Cricket Powerplay', description: 'Overs overview', text: 'Batters took calculated risks to maximize runs while bowlers focused on containment.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-55', title: 'Swimming Relay', description: 'Team event', text: 'Relay teams demonstrated synchronization and speed in every lap.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-56', title: 'Hockey Penalty', description: 'Game moment', text: 'The striker converted a penalty with precision, changing the momentum of the game.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-57', title: 'Volleyball Spike', description: 'Play highlight', text: 'A perfectly timed spike secured the team’s advantage during the critical set.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-58', title: 'Athlete Interview', description: 'Post-match insights', text: 'The player shared strategies and emotions experienced during the intense match.', difficulty: 'Intermediate', duration: '10 min', wpmTarget: 35 },

{ id: 'sports-59', title: 'Sports Motivation', description: 'Inspiring message', text: 'Great athletes achieve success through discipline, focus, and relentless effort.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 },

{ id: 'sports-60', title: 'Team Celebration', description: 'Victory moment', text: 'The team celebrated the championship win, acknowledging fans and supporters.', difficulty: 'Beginner', duration: '8 min', wpmTarget: 30 }


    ]
  },
  numbers: {
    name: 'Numbers & Symbols',
    icon: Zap,
    color: 'bg-cyan-500',
    description: 'Practice typing numbers and special characters',
    lessons: [
      { id: 'numbers-1', title: 'Basic Numbers', description: 'Type numbers 0-9', text: '0123456789 0123456789 1357924680 9876543210', difficulty: 'Beginner', duration: '5 min', wpmTarget: 20 },
      { id: 'numbers-2', title: 'Number Sequences', description: 'Practice sequences', text: '123 234 345 456 567 678 789 890', difficulty: 'Beginner', duration: '5 min', wpmTarget: 20 },

      { id: 'numbers-3', title: 'Odd & Even Numbers', description: 'Alternate odd and even', text: '13579 24680 97531 08642', difficulty: 'Beginner', duration: '5 min', wpmTarget: 20 },
      
      { id: 'numbers-4', title: 'Repeated Numbers', description: 'Type repeated patterns', text: '111 222 333 444 555 666 777 888 999 000', difficulty: 'Beginner', duration: '5 min', wpmTarget: 20 },
      
      { id: 'numbers-5', title: 'Number Patterns', description: 'Ascending and descending', text: '12 23 34 45 56 65 54 43 32 21', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-6', title: 'Simple Math Symbols', description: 'Type numbers with + - * /', text: '1+2-3*4/5 6+7-8*9/0', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-7', title: 'Brackets & Numbers', description: 'Practice brackets', text: '(1+2)-(3*4) {5/6} [7+8-9]', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-8', title: 'Decimal Numbers', description: 'Practice decimals', text: '3.14 2.71 1.618 0.577 4.669', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-9', title: 'Percentages', description: 'Type % symbols', text: '10% 20% 30% 40% 50% 60% 70% 80% 90% 100%', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-10', title: 'Currency Symbols', description: 'Practice $, €, £, ¥', text: '$100 €200 £300 ¥400 $500', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-11', title: 'Mixed Symbols', description: 'Numbers with symbols', text: '1! 2@ 3# 4$ 5% 6^ 7& 8* 9( 0)', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-12', title: 'Keyboard Symbols', description: 'Practice symbols', text: '!@#$ %^&* ()_+ {}|:', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-13', title: 'Random Numbers', description: 'Random digits typing', text: '4738291056 9182736450 5647382910 1029384756', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-14', title: 'Combined Symbols', description: 'Numbers + symbols', text: '1+2=3 4-2=2 3*3=9 8/4=2', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-15', title: 'Advanced Math', description: 'Math expressions', text: '(12+34)*2-5/5 7+8*(3-1)/2', difficulty: 'Advanced', duration: '7 min', wpmTarget: 30 },
      
      { id: 'numbers-16', title: 'Pi & E Values', description: 'Math constants', text: 'π=3.14159 e=2.71828 φ=1.61803', difficulty: 'Advanced', duration: '7 min', wpmTarget: 30 },
      
      { id: 'numbers-17', title: 'Fractions', description: 'Type fractions', text: '1/2 2/3 3/4 4/5 5/6 6/7 7/8 8/9', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-18', title: 'Mixed Fractions', description: 'Numbers with symbols', text: '1 1/2 2 3/4 5 2/3 3 7/8', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-19', title: 'Exponents', description: 'Type powers', text: '2^3 3^2 5^4 7^2 10^3', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-20', title: 'Square Roots', description: 'Practice √ symbol', text: '√4 √9 √16 √25 √36', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-21', title: 'Equations', description: 'Simple equations', text: 'x+2=5 3y-4=11 2a+3b=10', difficulty: 'Advanced', duration: '7 min', wpmTarget: 30 },
      
      { id: 'numbers-22', title: 'Complex Symbols', description: 'Numbers + symbols', text: '[@123] {!456} (#789) {^0}', difficulty: 'Advanced', duration: '7 min', wpmTarget: 30 },
      
      { id: 'numbers-23', title: 'Random Symbols', description: 'Practice typing symbols', text: '!@#$%^&*()_+-={}[]|;:', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-24', title: 'Phone Numbers', description: 'Format practice', text: '+1-202-555-0123 +44-20-7946-0958 +91-98765-43210', difficulty: 'Beginner', duration: '5 min', wpmTarget: 20 },
      
      { id: 'numbers-25', title: 'Time Format', description: 'Typing time', text: '12:00 09:30 15:45 23:59 00:00', difficulty: 'Beginner', duration: '5 min', wpmTarget: 20 },
      
      { id: 'numbers-26', title: 'Date Format', description: 'Typing dates', text: '01/01/2025 12/12/2025 31/07/2025 15/08/2025', difficulty: 'Beginner', duration: '5 min', wpmTarget: 20 },
      
      { id: 'numbers-27', title: 'Mixed Numbers & Symbols', description: 'Practice combination', text: '123! 456@ 789# 012$ 345%', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-28', title: 'Keyboard Practice', description: 'Symbols on keyboard', text: '`~ !@ #$ %^ &* ()_- += {}[] |\\ :;"\'<>,.?/', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-29', title: 'Math Challenges', description: 'Equations & numbers', text: '5+3-2*4/2 10/2+7-3*2', difficulty: 'Advanced', duration: '7 min', wpmTarget: 30 },
      
      { id: 'numbers-30', title: 'Symbols Combo 2', description: 'Practice mixed symbols', text: '!1 @2 #3 $4 %5 ^6 &7 *8 (9) _0', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 },
      
      { id: 'numbers-31', title: 'Advanced Math 2', description: 'Exponents & fractions', text: '2^5 3^4 5/8 7/9 9^2', difficulty: 'Advanced', duration: '7 min', wpmTarget: 30 },
      
      { id: 'numbers-32', title: 'Currency Combo', description: 'Typing $ € £ ¥', text: '$100 €200 £300 ¥400 $500 €600 £700 ¥800', difficulty: 'Intermediate', duration: '6 min', wpmTarget: 25 }
      
    ]
  },
  science: {
    name: 'Science',
    icon: BookOpen,
    color: 'bg-teal-500',
    description: 'Scientific terminology and facts',
    lessons: [
    
      { id: 'science-1', title: 'Physics Basics', description: 'Newton’s laws', text: 'Newton’s three laws of motion describe the relationship between the motion of an object and the forces acting on it.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },

      { id: 'science-2', title: 'Cell Structure', description: 'Biology basics', text: 'Cells are the basic structural units of life, consisting of organelles like the nucleus, mitochondria, and ribosomes.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'science-3', title: 'Periodic Table', description: 'Chemical elements', text: 'The periodic table organizes elements based on atomic number, electron configuration, and recurring chemical properties.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-4', title: 'States of Matter', description: 'Solid, liquid, gas', text: 'Matter exists in solid, liquid, and gas states, and can transition through melting, freezing, condensation, and evaporation.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'science-5', title: 'Photosynthesis', description: 'Plant process', text: 'Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-6', title: 'Human Anatomy', description: 'Body systems', text: 'The human body has several systems including circulatory, respiratory, digestive, nervous, and skeletal systems.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-7', title: 'Astronomy Basics', description: 'Solar system', text: 'The solar system consists of the sun, eight planets, their moons, and other celestial objects like asteroids and comets.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'science-8', title: 'Energy Forms', description: 'Types of energy', text: 'Energy exists in multiple forms including kinetic, potential, thermal, chemical, electrical, and nuclear energy.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-9', title: 'Acids and Bases', description: 'Chemistry concepts', text: 'Acids release hydrogen ions in solution while bases release hydroxide ions, and their strength is measured by pH.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-11', title: 'Genetics Basics', description: 'DNA and genes', text: 'DNA carries genetic information in organisms, and genes are segments of DNA that determine inherited traits.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-12', title: 'Force & Motion', description: 'Physics concepts', text: 'Force is a push or pull on an object, and motion is described by speed, velocity, and acceleration.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'science-13', title: 'Electric Circuits', description: 'Basic electronics', text: 'Electric circuits consist of a power source, conductive path, and load, allowing current to flow and do work.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-14', title: 'Human Senses', description: 'Sensory organs', text: 'Humans perceive the world through five senses: sight, hearing, taste, touch, and smell.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'science-15', title: 'Respiration', description: 'Breathing process', text: 'Respiration is the process of exchanging gases, where oxygen is taken in and carbon dioxide is expelled.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-16', title: 'Magnetism', description: 'Magnetic forces', text: 'Magnetism is a force of attraction or repulsion caused by moving electric charges and magnetic materials.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-17', title: 'Weather & Climate', description: 'Atmospheric science', text: 'Weather describes short-term atmospheric conditions, while climate refers to long-term patterns in a region.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'science-18', title: 'Chemical Bonds', description: 'Atoms interaction', text: 'Atoms form chemical bonds like covalent, ionic, and metallic bonds to achieve stability and form compounds.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-19', title: 'Nutrition', description: 'Food & health', text: 'Nutrients include carbohydrates, proteins, fats, vitamins, and minerals, which are essential for energy and growth.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'science-20', title: 'Evolution', description: 'Biological theory', text: 'Evolution explains how species change over time through natural selection and genetic variation.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-21', title: 'Light & Optics', description: 'Physics of light', text: 'Light exhibits reflection, refraction, and diffraction, and can be separated into a spectrum using a prism.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-22', title: 'Sound Waves', description: 'Acoustics', text: 'Sound is a mechanical wave that travels through mediums by vibrating particles, characterized by frequency and amplitude.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-23', title: 'Photosynthesis Advanced', description: 'Plant energy', text: 'Chlorophyll captures light energy to convert carbon dioxide and water into glucose and oxygen during photosynthesis.', difficulty: 'Advanced', duration: '15 min', wpmTarget: 38 },
      
      { id: 'science-24', title: 'Cell Division', description: 'Mitosis & Meiosis', text: 'Cells divide through mitosis for growth and repair, or meiosis for sexual reproduction.', difficulty: 'Advanced', duration: '15 min', wpmTarget: 38 },
      
      { id: 'science-25', title: 'Human Immune System', description: 'Defense mechanism', text: 'The immune system protects the body using white blood cells, antibodies, and other defense mechanisms.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-26', title: 'Solar Energy', description: 'Renewable energy', text: 'Solar panels convert sunlight into electricity using photovoltaic cells.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-27', title: 'Earth Layers', description: 'Geology basics', text: 'Earth consists of the crust, mantle, outer core, and inner core, each with distinct properties.', difficulty: 'Beginner', duration: '10 min', wpmTarget: 30 },
      
      { id: 'science-28', title: 'Volcanoes', description: 'Geological events', text: 'Volcanoes erupt molten rock, ash, and gases, forming mountains and affecting climate.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-29', title: 'Force & Pressure', description: 'Physics concepts', text: 'Pressure is force applied per unit area, and it plays a key role in fluids and mechanics.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 },
      
      { id: 'science-30', title: 'Atomic Structure', description: 'Atoms & electrons', text: 'Atoms consist of protons, neutrons, and electrons, with electrons arranged in energy levels around the nucleus.', difficulty: 'Intermediate', duration: '12 min', wpmTarget: 32 }
      
    ]
  }
};

const AchievementContext = createContext()

const AchievementProvider = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());

  const unlockAchievement = (achievementId) => {
    setUnlockedAchievements(prev => {
      if (prev.has(achievementId)) return prev;
      return new Set([...prev, achievementId]);
    });
  };

  const addSession = (sessionData) => {
    unlockAchievement('first-steps');
    if (sessionData.wpm >= 20) unlockAchievement('speed-demon-20');
    if (sessionData.wpm >= 40) unlockAchievement('speed-demon-40');
    if (sessionData.accuracy === 100) unlockAchievement('perfectionist');
  };

  return (
    <AchievementContext.Provider value={{
      unlockedAchievements,
      unlockAchievement,
      addSession
    }}>
      {children}
    </AchievementContext.Provider>
  );
};

const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
};

// Sound effect generator function
const playTypeSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  
  oscillator.frequency.value = 800 + Math.random() * 200;
  oscillator.type = 'sine';
  
  gain.gain.setValueAtTime(0.1, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
};

const TypingInterface = () => {
  const { unlockedAchievements, addSession: addAchievementSession } = useAchievements();
  const { addSession: addUserSession, currentUser } = useUser();
  
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLessons, setShowLessons] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionStats, setCompletionStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonText, setLessonText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const completionFiredRef = useRef(false);
  const [fontSize, setFontSize] = useState('xxlarge');
  const [soundType, setSoundType] = useState('click');
  
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isPlaying && startTime) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, startTime]);

  useEffect(() => {
    if (userInput.length === 0 || !lessonText) return;

    const correctChars = userInput.split('').reduce((acc, char, index) => {
      return lessonText[index] === char ? acc + 1 : acc;
    }, 0);

    const newAccuracy = Math.round((correctChars / userInput.length) * 100);
    setAccuracy(newAccuracy);
    const newMistakes = userInput.length - correctChars;
    setMistakes(newMistakes);

    const newProgress = Math.min((userInput.length / lessonText.length) * 100, 100);
    setProgress(newProgress);

    let newWpm = 0;
    if (timeElapsed > 0) {
      const wordsTyped = userInput.length / 5;
      const minutesElapsed = timeElapsed / 60;
      newWpm = Math.round(wordsTyped / minutesElapsed);
      setWpm(newWpm);
    }

    // Use ref guard so completeLesson fires exactly once per lesson attempt
    if (userInput === lessonText && currentLesson && !completionFiredRef.current) {
      completionFiredRef.current = true;
      completeLesson(newWpm, newAccuracy, newMistakes);
    }
  }, [userInput, timeElapsed, lessonText, currentLesson]);

  const completeLesson = (finalWpm, finalAccuracy, finalMistakes) => {
    if (!currentLesson) return;

    const sessionData = {
      lessonId:        currentLesson.id,
      wpm:             finalWpm,
      accuracy:        finalAccuracy,
      duration:        timeElapsed,
      mistakes:        finalMistakes,
      wordsTyped:      Math.round(userInput.length / 5),
      lessonType:      currentLesson.difficulty || '',
      charactersTyped: userInput.length,
    };

    // Save to dashboard / Appwrite
    addUserSession(sessionData);

    // Unlock achievements
    addAchievementSession(sessionData);
    
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
    
    setCompletionStats({
      title:       currentLesson.title,
      wpm:         finalWpm,
      accuracy:    finalAccuracy,
      timeElapsed: timeElapsed,
      mistakes:    finalMistakes,
      wpmTarget:   currentLesson.wpmTarget
    });
    
    setIsPlaying(false);
    setShowCompletion(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isPlaying || value.length > lessonText.length) return;
    
    if (soundEnabled) {
      playTypeSound();
    }
    
    setUserInput(value);
  };

  const handleStart = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
    inputRef.current?.focus();
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const resetStats = () => {
    completionFiredRef.current = false;
    setUserInput("");
    setTimeElapsed(0);
    setAccuracy(100);
    setWpm(0);
    setProgress(0);
    setMistakes(0);
    setIsPlaying(false);
    setStartTime(null);
  };

  const selectLesson = (lesson) => {
    setCurrentLesson(lesson);
    setLessonText(lesson.text);
    resetStats();
    setShowLessons(false);
    setShowAchievements(false);
    setShowCompletion(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderChar = (char, index) => {
    const typedChar = userInput[index];
    const isCurrentChar = index === userInput.length && isPlaying;
    
    return (
      <span key={index} className={`${isCurrentChar ? 'bg-blue-500 text-white animate-pulse' : ''} ${typedChar == null ? "text-gray-400" : typedChar === char ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"} rounded`}>
        {char === ' ' ? '·' : char}
      </span>
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFontSizeClass = () => {
    const sizes = { 
      small: 'text-sm', 
      medium: 'text-base', 
      large: 'text-lg', 
      xlarge: 'text-xl',
      xxlarge: 'text-2xl',
      xxxlarge: 'text-3xl',
      huge: 'text-4xl'
    };
    return sizes[fontSize] || 'text-base';
  };

  // Journey helpers
  const getCurrentLessonIndex = () => {
    if (!selectedCategory || !currentLesson) return 0;
    return selectedCategory.lessons.findIndex(l => l.id === currentLesson.id);
  };

  const goToNextLesson = () => {
    if (!selectedCategory || !currentLesson) return;
    const idx = getCurrentLessonIndex();
    const next = selectedCategory.lessons[idx + 1];
    if (next) {
      selectLesson(next);
    } else {
      setShowLessons(true);
      setSelectedCategory(null);
      setShowCompletion(false);
    }
  };

  // Achievements Page
  if (showAchievements) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setShowAchievements(false)} className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
              <ArrowLeft className="w-5 h-5 mr-2" />Back
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Achievements</h1>
            <div className="w-20"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 text-center shadow-lg">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{unlockedAchievements.size}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Unlocked</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 text-center shadow-lg">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{unlockedAchievements.size * 50}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Points</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 text-center shadow-lg">
              <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{Math.round((unlockedAchievements.size / 4) * 100)}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Complete</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 text-center shadow-lg">
              <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">1</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Level</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { id: 'first-steps', title: 'First Steps', description: 'Complete first session', icon: Heart },
              { id: 'speed-demon-20', title: 'Getting Started', description: 'Reach 20 WPM', icon: Zap },
              { id: 'speed-demon-40', title: 'Speed Demon', description: 'Reach 40 WPM', icon: Flame },
              { id: 'perfectionist', title: 'Perfectionist', description: 'Achieve 100% accuracy', icon: Target }
            ].map(achievement => {
              const Icon = achievement.icon;
              const unlocked = unlockedAchievements.has(achievement.id);
              return (
                <div key={achievement.id} className={`rounded-xl p-6 border-2 ${unlocked ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 bg-gray-100'}`}>
                  <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-300'}`}>
                    {unlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>{achievement.title}</h3>
                  <p className={`text-sm mb-4 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>{achievement.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${unlocked ? 'text-yellow-600' : 'text-gray-400'}`}>50 Pts</span>
                    {unlocked && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Lessons Page
  if (showLessons) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <Keyboard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TypingMaster Pro</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAchievements(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium">
                <Trophy className="w-5 h-5" /><span className="text-lg">{unlockedAchievements.size}</span>
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
              </button>
            </div>
          </div>

          {!selectedCategory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(LESSON_CATEGORIES).map(([key, category]) => {
                const IconComponent = category.icon;
                const completedCount = category.lessons.filter(l => completedLessons.has(l.id)).length;
                return (
                  <div key={key} onClick={() => setSelectedCategory(category)} className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 border border-gray-200 p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} rounded-lg mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{category.lessons.length} lessons</span>
                      <span>{completedCount} done</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setSelectedCategory(null)} className="flex items-center text-blue-600 font-medium">
                  <ArrowLeft className="w-4 h-4 mr-2" />Back
                </button>
                {/* Journey progress */}
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedCategory.lessons.filter(l => completedLessons.has(l.id)).length} / {selectedCategory.lessons.length} done
                  </div>
                  <button
                    onClick={() => {
                      const firstNotDone = selectedCategory.lessons.find(l => !completedLessons.has(l.id)) || selectedCategory.lessons[0];
                      selectLesson(firstNotDone);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <Star className="w-4 h-4" />
                    Start Journey
                  </button>
                </div>
              </div>

              {/* Category progress bar */}
              <div className="mb-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 shadow-md">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-semibold">{selectedCategory.name} — Journey Progress</span>
                  <span>{Math.round((selectedCategory.lessons.filter(l => completedLessons.has(l.id)).length / selectedCategory.lessons.length) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${(selectedCategory.lessons.filter(l => completedLessons.has(l.id)).length / selectedCategory.lessons.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCategory.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    onClick={() => selectLesson(lesson)}
                    className={`bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg cursor-pointer hover:scale-105 border-2 p-6 transition-all ${
                      completedLessons.has(lesson.id)
                        ? 'border-green-400 dark:border-green-600'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500">#{idx + 1}</span>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{lesson.title}</h3>
                      </div>
                      {completedLessons.has(lesson.id)
                        ? <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        : <Star className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{lesson.description}</p>
                    <div className={`text-xs font-medium px-2 py-1 rounded w-fit mb-3 ${getDifficultyColor(lesson.difficulty)}`}>{lesson.difficulty}</div>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
                      {completedLessons.has(lesson.id) ? 'Replay' : idx === 0 || completedLessons.has(selectedCategory.lessons[idx - 1]?.id) ? 'Start' : 'Start'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Typing Page
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      {/* XP Completion Overlay */}
      {showCompletion && completionStats && (
        <LessonCompleteScreen
          stats={{
            wpm: completionStats.wpm,
            accuracy: completionStats.accuracy,
            timeElapsed: completionStats.timeElapsed,
            mistakes: completionStats.mistakes,
            wpmTarget: completionStats.wpmTarget,
          }}
          lessonTitle={completionStats.title}
          lessonIndex={getCurrentLessonIndex()}
          totalLessons={selectedCategory ? selectedCategory.lessons.length : 1}
          hasNextLesson={!!selectedCategory && getCurrentLessonIndex() < selectedCategory.lessons.length - 1}
          onRetry={() => { resetStats(); setShowCompletion(false); }}
          onNextLesson={goToNextLesson}
          onMenu={() => { setShowLessons(true); setSelectedCategory(null); setShowCompletion(false); }}
          autoNextDelay={5}
        />
      )}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowLessons(true)} className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Keyboard className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TypingMaster</h1>
          </div>
          <div className="flex gap-2">
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-sm">Aa</button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                {['small', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge', 'huge'].map((size) => (
                  <button key={size} onClick={() => setFontSize(size)} className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${fontSize === size ? 'bg-blue-50 dark:bg-blue-900' : ''}`}>
                    {size === 'small' ? 'Small' : size === 'medium' ? 'Medium' : size === 'large' ? 'Large' : size === 'xlarge' ? 'X-Large' : size === 'xxlarge' ? '2X-Large' : size === 'xxxlarge' ? '3X-Large' : 'Huge'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative group">
              <button className={`p-3 rounded-lg ${soundEnabled ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
                {soundEnabled ? <Volume2 className="w-4 h-4 text-green-600" /> : <VolumeX className="w-4 h-4 text-red-600" />}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 border border-gray-200 dark:border-gray-700">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Sound Options</h3>
                  <label className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                    <input type="radio" name="sound" checked={soundEnabled} onChange={() => setSoundEnabled(true)} className="w-4 h-4" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                    <input type="radio" name="sound" checked={!soundEnabled} onChange={() => setSoundEnabled(false)} className="w-4 h-4" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Disabled</span>
                  </label>
                </div>
              </div>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-lg bg-white/10">
              {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
          </div>
        </div>

        {currentLesson ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className="bg-white/10 rounded-lg p-4"><div className="flex gap-1 mb-2"><Timer className="w-5 h-5 text-blue-500" /><span className="text-base text-gray-600">Time</span></div><div className="text-3xl font-bold">{formatTime(timeElapsed)}</div></div>
              <div className="bg-white/10 rounded-lg p-4"><div className="flex gap-1 mb-2"><Zap className="w-5 h-5 text-green-500" /><span className="text-base text-gray-600">WPM</span></div><div className="text-3xl font-bold">{wpm}</div></div>
              <div className="bg-white/10 rounded-lg p-4"><div className="flex gap-1 mb-2"><Target className="w-5 h-5 text-purple-500" /><span className="text-base text-gray-600">Accuracy</span></div><div className="text-3xl font-bold">{accuracy}%</div></div>
              <div className="bg-white/10 rounded-lg p-4"><div className="flex gap-1 mb-2"><X className="w-5 h-5 text-red-500" /><span className="text-base text-gray-600">Mistakes</span></div><div className="text-3xl font-bold">{mistakes}</div></div>
              <div className="bg-white/10 rounded-lg p-4"><div className="flex gap-1 mb-2"><TrendingUp className="w-5 h-5 text-orange-500" /><span className="text-base text-gray-600">Progress</span></div><div className="text-3xl font-bold">{Math.round(progress)}%</div></div>
            </div>

            <div className="mb-6"><div className="bg-white/10 rounded-full h-3 overflow-hidden"><div className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all" style={{ width: `${progress}%` }} /></div></div>

            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">{currentLesson.title}</h2>
              <div className="flex items-center gap-2">
                {selectedCategory && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    #{getCurrentLessonIndex() + 1} of {selectedCategory.lessons.length}
                  </span>
                )}
                <div className={`text-sm font-medium px-2 py-1 rounded ${getDifficultyColor(currentLesson.difficulty)}`}>{currentLesson.difficulty}</div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-white/10 rounded-xl"><div className="overflow-y-auto max-h-40 mb-4"><p className={`${getFontSizeClass()} font-mono p-4 bg-white/5 rounded-lg select-none break-words`}>{lessonText.split("").map(renderChar)}</p></div><textarea ref={inputRef} value={userInput} onChange={handleInputChange} disabled={!isPlaying} placeholder={isPlaying ? "Start typing..." : "Click Start"} spellCheck="false" className={`w-full h-28 ${getFontSizeClass()} font-mono bg-white/5 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 p-3 resize-none`} /></div>

            <div className="flex gap-3 mb-4 flex-wrap">
              <button onClick={handleStart} disabled={isPlaying} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg disabled:opacity-50 text-sm font-medium">
                <Play className="w-4 h-4" /> Start
              </button>
              <button onClick={handlePause} disabled={!isPlaying} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg disabled:opacity-50 text-sm font-medium">
                <Pause className="w-4 h-4" /> Pause
              </button>
              <button onClick={resetStats} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg text-sm font-medium">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              {selectedCategory && selectedCategory.lessons.findIndex(l => l.id === currentLesson.id) < selectedCategory.lessons.length - 1 && (
                <button 
                  onClick={() => {
                    const currentIndex = selectedCategory.lessons.findIndex(l => l.id === currentLesson.id);
                    const nextLesson = selectedCategory.lessons[currentIndex + 1];
                    if (nextLesson) selectLesson(nextLesson);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium ml-auto"
                >
                  Next Lesson
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Keyboard className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Choose a lesson</h2>
            <button onClick={() => setShowLessons(true)} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium">
              Choose Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AchievementProvider>
      <TypingInterface />
    </AchievementProvider>
  );
};

export default App;
