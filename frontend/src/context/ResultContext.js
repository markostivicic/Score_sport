import { useState, createContext, ReactNode, useContext } from "react";

const ResultContext = createContext();

export function useResultContext() {
  return useContext(ResultContext);
}

export function ResultContextProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  return (
    <ResultContext.Provider
      value={{
        authenticatedUser,
        setAuthenticatedUser,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
}
