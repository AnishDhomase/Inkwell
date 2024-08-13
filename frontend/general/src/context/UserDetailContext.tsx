import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContextType {
  count: number;
  setCount: (count: number) => void;
}

const UserDetailsContext = createContext<ContextType | undefined>(undefined);

// Create a provider component
interface AppProviderProps {
  children: ReactNode;
}

export const UserDetailsProvider: React.FC<AppProviderProps> = ({
  children,
}) => {
  const [userDetails, setUserDetails] = useState();

  return (
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUserDetails = () => {
  const context = useContext(UserDetailsContext);
  if (context === undefined) {
    throw new Error("useUserDetails must be used within an AppProvider");
  }
  return context;
};
