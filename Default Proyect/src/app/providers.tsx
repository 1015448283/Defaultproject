import { createContext, useContext } from 'react';

interface AppContextType {
  // Placeholder for future context extensions
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProviders');
  }
  return context;
}
