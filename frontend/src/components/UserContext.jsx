import { createContext, useContext, useState } from "react";
import { getUser, saveUser, clearUser } from "../lib/user.js";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUserState] = useState(getUser());

  function setUser(next) {
    setUserState(next);
    if (next) saveUser(next);
    else clearUser();
  }

  const value = {
    user,
    setUser,
    logout: () => setUser(null)
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
