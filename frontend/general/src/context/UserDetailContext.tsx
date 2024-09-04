import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getSelfDetails } from "../apis/api";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
interface ContextType {
  selfDetails: object;
  notifications: string[];
  setSelfDetails: React.Dispatch<React.SetStateAction<object>>;
  setNotifications: React.Dispatch<React.SetStateAction<string[]>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const UserDetailsContext = createContext<ContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const UserDetailsProvider: React.FC<AppProviderProps> = ({
  children,
}) => {
  const [selfDetails, setSelfDetails] = useState<object>({});
  const [notifications, setNotifications] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  //   Fetch self details
  useEffect(() => {
    async function fetchSelfDetails() {
      const details = await getSelfDetails();
      setSelfDetails(details);
      setNotifications(details?.notifications);
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

// Custom hook to use the context
export const useUserDetails = () => {
  const context = useContext(UserDetailsContext);
  if (context === undefined) {
    throw new Error("useUserDetails must be used within an AppProvider");
  }
  return context;
};
