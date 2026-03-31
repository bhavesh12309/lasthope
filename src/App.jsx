import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { SettingsProvider } from "./contexts/SettingsContext";

import Navigation from "./components/Navigation";
import Homepage from "./components/Homepage";
import CustomLessonBuilder from "./components/CustomLessonBuilder";
import TypingInterface from "./components/TypingInterface";
import SmartTypingPractice from "./components/SmartTypingPractice";
import Dashboard from "./components/Dashboard";
import Achievements from "./components/Achievements";
import Settings from "./components/Settings";
import Leaderboard from "./components/Leaderboard";
import About from "./components/About";
import Contact from "./components/Contact";
import Help from "./components/Help";
import Footer from "./components/Footer";
import CertificateGenerator from "./components/CertificateGenerator";
import AvatarBuilder from "./components/AvatarBuilder";
import Login from "./components/Login";
import Signup from "./components/Signup";


// Typing mode components
import EndlessMode from "./components/EndlessMode";
import WordCountMode from "./components/WordCountMode";
import TimeSessionMode from "./components/TimeSessionMode";

import "./App.css";

// Certificate wrapper
const CertificatePage = () => {
  const { stats } = useUser();
  return (
    <CertificateGenerator
      stats={stats}
      onClose={() => window.history.back()}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SettingsProvider>
          <Router>
            <div className="app">
              <Navigation />

              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/certificate" element={<CertificatePage />} />
                <Route path="/custom" element={<CustomLessonBuilder />} />
                <Route path="/smart-practice" element={<SmartTypingPractice />} />
                <Route path="/avatar" element={<AvatarBuilder />} />

                {/* Typing Modes */}
                <Route path="/typing/time-session" element={<TimeSessionMode />} />
                <Route path="/typing/word-count" element={<WordCountMode />} />
                <Route path="/typing/endless" element={<EndlessMode />} />

                {/* Main Typing Interface */}
                <Route path="/typing" element={<TypingInterface />} />
              </Routes>

              <Footer />
            </div>
          </Router>
        </SettingsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;