import React, { createContext, useContext, useState } from "react";

const TypingContext = createContext();

export const TypingProvider = ({ children }) => {
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    mistakes: 0,
    charactersTyped: 0,
  });
  const [timeElapsed, setTimeElapsed] = useState(0);

  return (
    <TypingContext.Provider value={{ stats, setStats, timeElapsed, setTimeElapsed }}>
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => useContext(TypingContext);
