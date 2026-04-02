import React, { useState, useEffect } from 'react';
import { Github, Mail, Heart, Keyboard, Trophy, Users, Star, ArrowUp } from 'lucide-react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heartBeat, setHeartBeat] = useState(false);

  useEffect(() => {
    const heartInterval = setInterval(() => {
      setHeartBeat(true);
      setTimeout(() => setHeartBeat(false), 300);
    }, 3000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(heartInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/bhavesh12309", label: "GitHub", color: "hover:text-gray-300" },
    { icon: Mail, href: "mailto:typing123316", label: "Email", color: "hover:text-green-400" }
  ];

  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy.html" },
    { name: "Terms of Service", href: "/terms.html" },
    { name: "FAQ", href: "/faq" }
  ];

  const features = [
    { name: "Smart Practice", href: "#", description: "AI-powered lessons" },
    { name: "Achievements", href: "#", description: "Unlock rewards" },
    { name: "Leaderboards", href: "#", description: "Compete globally" },
    { name: "Progress Tracking", href: "#", description: "Monitor improvement" },
    { name: "Custom Tests", href: "#", description: "Personalized content" },
    { name: "Speed Challenges", href: "#", description: "Timed competitions" }
  ];

  return (
    <>
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transition-transform duration-300 ${heartBeat ? 'scale-110' : ''}`}>
                  <Heart className={`w-8 h-8 text-white transition-all duration-300 ${heartBeat ? 'text-red-300' : ''}`} />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TypeMaster
                  </span>
                  <div className="text-sm text-gray-400">Pro Typing Platform</div>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Master your typing skills with our interactive, gamified learning platform.
                Join thousands of users improving their speed and accuracy daily.
              </p>

              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Connect With Us</div>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-center w-12 h-12 bg-gray-800/50 rounded-xl border border-gray-700/50 text-gray-400 ${social.color} transition-all duration-300 hover:border-gray-600 hover:bg-gray-700/50 hover:scale-110`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Stay Updated</div>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white relative">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                    >
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors duration-300"></div>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white relative">
                Features
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-teal-600"></div>
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index}>
                    <a
                      href={feature.href}
                      className="text-gray-400 hover:text-white group transition-all duration-300"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 group-hover:bg-green-500 transition-colors duration-300"></div>
                        <div>
                          <div className="group-hover:translate-x-1 transition-transform duration-300">
                            {feature.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{feature.description}</div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-gray-400">
                <p>&copy; 2024 TypeMaster. All rights reserved.</p>
                <div className="flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className={`w-4 h-4 text-red-500 ${heartBeat ? 'animate-pulse' : ''}`} />
                  <span>for typing enthusiasts</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-gray-400 ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg text-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 mx-auto" />
        </button>
      )}
    </>
  );
};

export default Footer;
