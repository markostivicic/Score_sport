import { useState, createContext, useContext } from "react";

const ResultContext = createContext();

export function useResultContext() {
  return useContext(ResultContext);
}

export function ResultContextProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [currentSport, setCurrentSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const curr = new Date();
    return curr.toISOString().substring(0, 10);
  });
  return (
    <ResultContext.Provider
      value={{
        authenticatedUser,
        setAuthenticatedUser,
        currentSport,
        setCurrentSport,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
}
