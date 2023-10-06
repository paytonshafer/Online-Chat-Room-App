// UserContext.js
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null); // function and variable to get and set the username globally

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}