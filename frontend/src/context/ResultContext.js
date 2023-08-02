import { useState, createContext, useContext } from "react";
import { stringHr } from "../services/TranslateService";

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
  const [currentLeagueTab, setCurrentLeagueTab] = useState("clubs");
  const [currentClubTab, setCurrentClubTab] = useState("players");
  const [selectedDate, setSelectedDate] = useState(() => {
    const curr = new Date();
    return curr.toISOString().substring(0, 10);
  });
  const [isSideNavActive, setIsSideNavActive] = useState(false);
  const [lang, setLang] = useState(JSON.stringify(stringHr));
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
        currentLeagueTab,
        setCurrentLeagueTab,
        currentClubTab,
        setCurrentClubTab,
        lang,
        setLang,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
}
