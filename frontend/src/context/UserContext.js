// UserContext.js
import { createContext, useContext, useState } from 'react';
import { nanoid } from 'nanoid' // generate unique user id

const UserContext = createContext();

export function useUserContext() {
  	return useContext(UserContext);
}

export function UserProvider({ children }) {
  	const [username, setUsername] = useState(null); // function and variable to get and set the username globally
	const [curRoom, setCurRoom] = useState(null) // current room you are in
	const [gmessages, setGMessages] = useState([]) // message bufer
	const [userRoomList, setUserRoomList] = useState([]) // list of objects of form: {room: "name", users: [list of usernames]}
  	const [id, ] = useState(nanoid(10)) // create unique id for user -> use in homepage for determining messages (10 chars)

	return (
		<UserContext.Provider value={{ id, username, setUsername, gmessages, setGMessages, userRoomList, setUserRoomList, curRoom, setCurRoom }}>
			{children}
		</UserContext.Provider>
	);
}