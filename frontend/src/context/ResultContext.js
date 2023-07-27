import { useState, createContext, ReactNode, useContext } from "react";

const ResultContext = createContext();

export function useResultContext() {
  return useContext(ResultContext);
}

export function ResultContextProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <ResultContext.Provider
      value={{
        loggedIn,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
}
