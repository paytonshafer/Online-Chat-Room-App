// UserContext.js
import { createContext, useContext, useState } from 'react';
import { nanoid } from 'nanoid' // generate unique user id

const UserContext = createContext();

export function useUserContext() {
  	return useContext(UserContext);
}

export function UserProvider({ children }) {
  	const [username, setUsername] = useState(null); // function and variable to get and set the username globally
  	const [id, ] = useState(nanoid(10)) // create unique id for user -> use in homepage for determining messages (10 chars)

	return (
		<UserContext.Provider value={{ id, username, setUsername }}>
			{children}
		</UserContext.Provider>
	);
}