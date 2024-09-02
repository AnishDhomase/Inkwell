import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getSelfDetails } from "../apis/api";

interface ContextType {
  selfDetails: object;
  notifications: string[];
  setSelfDetails: React.Dispatch<React.SetStateAction<object>>;
  setNotifications: React.Dispatch<React.SetStateAction<string[]>>;
}

const UserDetailsContext = createContext<ContextType | undefined>(undefined);

// Create a provider component
interface AppProviderProps {
  children: ReactNode;
}

export const UserDetailsProvider: React.FC<AppProviderProps> = ({
  children,
}) => {
  const [selfDetails, setSelfDetails] = useState<object>({});
  const [notifications, setNotifications] = useState<string[]>([]);

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
      value={{ selfDetails, notifications, setSelfDetails, setNotifications }}
    >
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
