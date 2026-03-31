import React, { useState, useRef } from 'react';
import { Download, X, Palette, Crown, Zap, Target, Award, Calendar, Eye, EyeOff, Plus, Minus, Share2, Copy, Check } from 'lucide-react';

const EnhancedCertificateGenerator = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareActive, setShareActive] = useState(false);
  const [showCustomization, setShowCustomization] = useState(true);
  const [activeTab, setActiveTab] = useState('text');
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState('Your Name');
  const [achievementTitle, setAchievementTitle] = useState('Master Typist');
  const [description, setDescription] = useState('For outstanding dedication and performance in typing excellence.');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US'));
  const [wpm, setWpm] = useState(100);
  const [accuracy, setAccuracy] = useState(98);
  const [level, setLevel] = useState(12);
  const [timeSpent, setTimeSpent] = useState(200);

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColor, setSelectedColor] = useState('blue');

  const colorThemes = {
    blue: { primary: '#2563eb', dark: '#1e40af', light: '#dbeafe' },
    purple: { primary: '#7c3aed', dark: '#6d28d9', light: '#f3e8ff' },
    emerald: { primary: '#059669', dark: '#047857', light: '#d1fae5' },
    amber: { primary: '#d97706', dark: '#b45309', light: '#fef3c7' },
    rose: { primary: '#e11d48', dark: '#be123c', light: '#ffe4e6' },
  };

  const templates = {
    classic: { name: 'Classic', borderWidth: 15, borderStyle: 'double' },
    modern: { name: 'Modern', borderWidth: 6, borderStyle: 'solid' },
    elegant: { name: 'Elegant', borderWidth: 3, borderStyle: 'solid' },
    minimal: { name: 'Minimal', borderWidth: 0, borderStyle: 'none' },
  };

  const currentTemplate = templates[selectedTemplate];
  const currentTheme = colorThemes[selectedColor];

  const downloadCertificate = () => {
    setIsGenerating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions (A4 ratio with more height for all content)
      const width = 1200;
      const height = 1700;
      canvas.width = width;
      canvas.height = height;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw border
      if (currentTemplate.borderWidth > 0) {
        ctx.strokeStyle = currentTheme.dark;
        ctx.lineWidth = currentTemplate.borderWidth;
        
        if (currentTemplate.borderStyle === 'double') {
          ctx.setLineDash([25, 15]);
        }
        
        const borderOffset = currentTemplate.borderWidth / 2;
        ctx.strokeRect(
          borderOffset + 30,
          borderOffset + 30,
          width - borderOffset * 2 - 60,
          height - borderOffset * 2 - 60
        );
        ctx.setLineDash([]);
      }

      const padding = 100;
      let y = padding + 40;

      // Crown circle
      ctx.fillStyle = currentTheme.primary;
      ctx.beginPath();
      ctx.arc(width / 2, y, 35, 0, Math.PI * 2);
      ctx.fill();
      y += 90;

      // Title
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 80px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE', width / 2, y);
      y += 90;

      // Subtitle
      ctx.font = '40px Georgia, serif';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('OF ACHIEVEMENT', width / 2, y);
      y += 80;

      // Decorative line
      ctx.strokeStyle = currentTheme.primary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 180, y);
      ctx.lineTo(width / 2 + 180, y);
      ctx.stroke();
      y += 80;

      // Certify text
      ctx.fillStyle = '#4b5563';
      ctx.font = '32px Georgia, serif';
      ctx.fillText('This is to certify that', width / 2, y);
      y += 60;

      // Name
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 60px Georgia, serif';
      ctx.fillText(userName.toUpperCase(), width / 2, y);
      y += 80;

      // Achievement badge background
      const badgeWidth = 600;
      const badgeHeight = 70;
      const badgeX = width / 2 - badgeWidth / 2;
      const badgeY = y - 40;
      
      ctx.fillStyle = currentTheme.primary;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 35);
      ctx.fill();

      // Achievement title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Georgia, serif';
      ctx.fillText(achievementTitle, width / 2, y + 20);
      y += 100;

      // Description - wrapped text
      ctx.fillStyle = '#4b5563';
      ctx.font = '24px Georgia, serif';
      const maxWidth = width - 2 * padding;
      const words = description.split(' ');
      let line = '';
      
      for (let word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          if (line) ctx.fillText(line, width / 2, y);
          line = word;
          y += 40;
        } else {
          line = testLine;
        }
      }
      if (line) ctx.fillText(line, width / 2, y);
      y += 80;

      // Stats boxes
      const statBoxWidth = 180;
      const statBoxHeight = 130;
      const statsStartY = y;
      const stats = [
        { label: 'WPM', value: wpm },
        { label: 'Accuracy', value: accuracy + '%' },
        { label: 'Level', value: level },
        { label: 'Minutes', value: timeSpent },
      ];

      const totalStatsWidth = stats.length * statBoxWidth + (stats.length - 1) * 30;
      const statsStartX = (width - totalStatsWidth) / 2;

      stats.forEach((stat, index) => {
        const statX = statsStartX + index * (statBoxWidth + 30);
        const statY = statsStartY;

        // Background
        ctx.fillStyle = currentTheme.light;
        ctx.fillRect(statX, statY, statBoxWidth, statBoxHeight);

        // Border
        ctx.strokeStyle = currentTheme.primary;
        ctx.lineWidth = 2;
        ctx.strokeRect(statX, statY, statBoxWidth, statBoxHeight);

        // Value
        ctx.fillStyle = currentTheme.dark;
        ctx.font = 'bold 42px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(stat.value, statX + statBoxWidth / 2, statY + 70);

        // Label
        ctx.font = '18px Georgia, serif';
        ctx.fillStyle = '#4b5563';
        ctx.fillText(stat.label, statX + statBoxWidth / 2, statY + 105);
      });

      y = statsStartY + statBoxHeight + 80;

      // Date
      ctx.fillStyle = '#4b5563';
      ctx.font = '20px Georgia, serif';
      ctx.fillText('Awarded on', width / 2, y);
      y += 40;

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText(date, width / 2, y);

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificate_${userName.replace(/\s+/g, '_')}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsGenerating(false);
      }, 'image/png', 1);

    } catch (error) {
      console.error('Error:', error);
      alert('Error generating certificate. Please try again.');
      setIsGenerating(false);
    }
  };

  const copyShareData = () => {
    const data = `🏆 Certificate of Achievement\n\n━━━━━━━━━━━━━━━━━━━━━━━━\nRecipient: ${userName}\nTitle: ${achievementTitle}\nDescription: ${description}\nDate: ${date}\n\n📊 Performance Metrics:\n• WPM: ${wpm}\n• Accuracy: ${accuracy}%\n• Level: ${level}\n• Time Spent: ${timeSpent} minutes\n━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const InputField = ({ label, value, onChange, type = 'text', icon: Icon }) => (
    <div className="group">
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea 
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          rows="3"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );

  const StatInput = ({ label, value, onChange, icon: Icon }) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(0, parseInt(value) - 1))} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button onClick={() => onChange(parseInt(value) + 1)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Certificate Generator
            </h2>
            <p className="text-sm text-gray-600 mt-1">Create and customize achievement certificates</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title={showCustomization ? 'Hide panel' : 'Show panel'}
            >
              {showCustomization ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShareActive(!shareActive)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              {shareActive && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4 z-10 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Share Certificate Data:</p>
                  <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-3 rounded max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
                    {`🏆 Certificate of Achievement\n\n━━━━━━━━━━━━━━━━━━━━━━━━\nRecipient: ${userName}\nTitle: ${achievementTitle}\nDescription: ${description}\nDate: ${date}\n\n📊 Performance Metrics:\n• WPM: ${wpm}\n• Accuracy: ${accuracy}%\n• Level: ${level}\n• Time Spent: ${timeSpent} minutes\n━━━━━━━━━━━━━━━━━━━━━━━━`}
                  </div>
                  <button
                    onClick={copyShareData}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={downloadCertificate}
              disabled={isGenerating}
              className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Download'}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Customization Panel */}
          {showCustomization && (
            <div className="w-96 border-r bg-gray-50 overflow-y-auto">
              <div className="flex gap-0 border-b sticky top-0 bg-white">
                {['text', 'stats', 'design'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 font-semibold text-sm transition-colors ${
                      activeTab === tab 
                        ? `border-b-2 border-blue-600 text-blue-600` 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                {activeTab === 'text' && (
                  <>
                    <InputField label="Recipient Name" value={userName} onChange={setUserName} />
                    <InputField label="Achievement Title" value={achievementTitle} onChange={setAchievementTitle} />
                    <InputField label="Description" value={description} onChange={setDescription} type="textarea" />
                    <InputField label="Date" value={date} onChange={setDate} type="date" />
                  </>
                )}

                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    <StatInput label="Best WPM" value={wpm} onChange={setWpm} icon={Zap} />
                    <StatInput label="Accuracy (%)" value={accuracy} onChange={setAccuracy} icon={Target} />
                    <StatInput label="Level" value={level} onChange={setLevel} icon={Award} />
                    <StatInput label="Time Spent (min)" value={timeSpent} onChange={setTimeSpent} icon={Calendar} />
                  </div>
                )}

                {activeTab === 'design' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Template Style
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(templates).map(([key, t]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedTemplate(key)}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                              selectedTemplate === key
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Color Theme
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(colorThemes).map(([key, theme]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedColor(key)}
                            className={`aspect-square rounded-xl transition-all ${
                              selectedColor === key ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: theme.primary }}
                            title={key.charAt(0).toUpperCase() + key.slice(1)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certificate Preview */}
          <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-auto p-8 flex items-center justify-center">
            <div
              className="bg-white p-12 relative w-full max-w-2xl shadow-lg"
              style={{ 
                fontFamily: 'Georgia, serif',
                aspectRatio: '1.41',
                border: currentTemplate.borderWidth > 0 ? `${currentTemplate.borderWidth / 2}px solid ${currentTheme.dark}` : 'none'
              }}
            >
              <div className="text-center mb-6 flex flex-col items-center">
                <div className="p-3 rounded-full mb-4" style={{ backgroundColor: currentTheme.primary }}>
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wider">CERTIFICATE</h1>
                <p className="text-lg text-gray-600 mt-1">OF ACHIEVEMENT</p>
                <div className="w-24 h-1.5 mt-4 rounded-full" style={{ backgroundColor: currentTheme.primary }} />
              </div>

              <div className="text-center mb-8">
                <p className="text-gray-700 text-lg mb-2">This is to certify that</p>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-wide">{userName.toUpperCase()}</h2>
                <div className="inline-block px-6 py-2.5 text-white rounded-full font-bold text-lg mb-4" style={{ backgroundColor: currentTheme.primary }}>
                  {achievementTitle}
                </div>
                <p className="text-gray-700 text-base leading-relaxed">{description}</p>
              </div>

              <div className="grid grid-cols-4 gap-3 my-8 text-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.light }}>
                  <Zap className="mx-auto w-5 h-5 mb-1" style={{ color: currentTheme.primary }} />
                  <div className="font-bold text-gray-900">{wpm}</div>
                  <div className="text-xs text-gray-600">WPM</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.light }}>
                  <Target className="mx-auto w-5 h-5 mb-1" style={{ color: currentTheme.primary }} />
                  <div className="font-bold text-gray-900">{accuracy}%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.light }}>
                  <Award className="mx-auto w-5 h-5 mb-1" style={{ color: currentTheme.primary }} />
                  <div className="font-bold text-gray-900">{level}</div>
                  <div className="text-xs text-gray-600">Level</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.light }}>
                  <Calendar className="mx-auto w-5 h-5 mb-1" style={{ color: currentTheme.primary }} />
                  <div className="font-bold text-gray-900">{timeSpent}</div>
                  <div className="text-xs text-gray-600">Minutes</div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Awarded on</p>
                <p className="font-semibold text-gray-800">{date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {show ? (
        <EnhancedCertificateGenerator onClose={() => setShow(false)} />
      ) : (
        <button 
          onClick={() => setShow(true)} 
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
        >
          Open Certificate Generator
        </button>
      )}
    </div>
  );
};

export default App;