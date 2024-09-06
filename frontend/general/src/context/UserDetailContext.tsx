import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getSelfDetails } from "../apis/api";
import { SelfDetailsType, Theme } from "../utils/types";

interface ContextType {
  selfDetails: SelfDetailsType | undefined;
  notifications: string[];
  setSelfDetails: React.Dispatch<
    React.SetStateAction<SelfDetailsType | undefined>
  >;
  setNotifications: React.Dispatch<React.SetStateAction<string[]>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export const UserDetailsContext = createContext<ContextType | undefined>(
  undefined
);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}
export const UserDetailsProvider: React.FC<AppProviderProps> = ({
  children,
}) => {
  const [selfDetails, setSelfDetails] = useState<SelfDetailsType>();
  const [notifications, setNotifications] = useState<string[]>([]);

  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  useEffect(() => {
    const themeFromLocalStorage = localStorage.getItem("themeInkwell");
    setTheme(themeFromLocalStorage === Theme.DARK ? Theme.DARK : Theme.LIGHT);
  }, [theme]);

  //   Fetch self details
  useEffect(() => {
    async function fetchSelfDetails() {
      const details = await getSelfDetails();
      setSelfDetails(details);
      setNotifications(details?.notifications || []);
    }
    fetchSelfDetails();
  }, []);

  return (
    <UserDetailsContext.Provider
      value={{
        selfDetails,
        notifications,
        theme,
        setSelfDetails,
        setNotifications,
        setTheme,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};
