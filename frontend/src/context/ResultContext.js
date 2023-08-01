import { useState, createContext, useContext } from "react";

const ResultContext = createContext();

export function useResultContext() {
  return useContext(ResultContext);
}

export function ResultContextProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [currentSport, setCurrentSport] = useState({
    id: "unique",
    name: "Favoriti",
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const curr = new Date();
    return curr.toISOString().substring(0, 10);
  });
  const [isSideNavActive, setIsSideNavActive] = useState(false);
  return (
    <ResultContext.Provider
      value={{
        authenticatedUser,
        setAuthenticatedUser,
        currentSport,
        setCurrentSport,
        selectedDate,
        setSelectedDate,
        isSideNavActive,
        setIsSideNavActive,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
}
