import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate through pages
import { useUserContext } from '../context/UserContext'; // get username context

// login page
const Login = ({ socket }) => {
    // NOTE for when we redesign front end -> username can not contain any spaces
    const [username, setUsername] = useState(''); // set state for username
    const [usernameTaken, setusernameTaken] = useState(false) // state for showing username taken message
    const navigate = useNavigate(); // initailize naviagtor
    const { login } = useUserContext(); // get login function to set the username in the context

    // function to handle username submission
    const handleLogin = (e) => {
        e.preventDefault(); // prevent default
        
        if(username.trim() === ""){ // ensure blank or just spaces as username cant be submitted
            setUsername("")
        } else {
            socket.emit('request_users', {}, (userList) => {
                // check if username is already taken
                if(userList.includes(username)){
                    setusernameTaken(true) // show taken message
                    setUsername("") // set username to blank (also clears input box)
                } else {
                    login(username); // set username in context
                    socket.emit("user_join", username); // send to server to broadcast that new user joined
                    navigate('/home'); // send user to the homepage
                    setusernameTaken(false) // reset usernmaeTaken field
                }
            })
        }
    };

    return (
        <div className="login-container">
        <h1>Login</h1>
        <h3>{usernameTaken ? "That username is taken please try another one" : ""}</h3>
        <form onSubmit={handleLogin}>
            <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                value={username.trim()}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            </div>
            <button type="submit">Login</button>
        </form>
        </div>
    );
}

export default Login;