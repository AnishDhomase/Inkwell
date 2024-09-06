import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserDetailsContext } from "../context/UserDetailContext";

// Custom hook to get the query params from the URL
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Custom hook to use the UserDetailsContext context
export const useUserDetails = () => {
  const context = useContext(UserDetailsContext);
  if (context === undefined) {
    throw new Error("useUserDetails must be used within an AppProvider");
  }
  return context;
};
