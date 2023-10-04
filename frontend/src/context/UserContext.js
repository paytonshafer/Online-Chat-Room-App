// UserContext.js
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);

  const login = (username) => {
    setUsername(username);
  };

  const logout = () => {
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}