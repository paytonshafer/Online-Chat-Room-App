import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate through pages
import { useUserContext } from '../context/UserContext'; // get username context
import './styles/login.css'

// login page
const Login = ({ socket }) => {
    // NOTE for when we redesign front end -> username can not contain any spaces
    const [temp_username, setTempUsername] = useState(''); // set state for username
    const [usernameTaken, setusernameTaken] = useState(false) // state for showing username taken message
    const navigate = useNavigate(); // initailize naviagtor
    const { setUsername } = useUserContext(); // get login function to set the username in the context

    // function to handle username submission
    const handleLogin = (e) => {
        e.preventDefault(); // prevent default
        
        if(temp_username.trim() === ""){ // ensure blank or just spaces as username cant be submitted
            setTempUsername("")
        } else {
            socket.emit('request_users', {}, (userList) => {
                // check if username is already taken
                if(userList.includes(temp_username)){
                    setusernameTaken(true) // show taken message
                    setTempUsername("") // set username to blank (also clears input box)
                } else {
                    setUsername(temp_username); // set username in context
                    socket.emit("user_join", temp_username); // send to server to broadcast that new user joined
                    navigate('/home'); // send user to the homepage
                    setusernameTaken(false) // reset usernmaeTaken field
                }
            })
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <h3 className={usernameTaken ? "error-message" : "hidden"}>
                That username is taken. Please try another one.
            </h3>
            <form onSubmit={handleLogin} className="login-container">
                <div className='username'>
                    <label className='username-label' htmlFor="username">Username:</label>
                    <input
                        className='usename-input-box'
                        type="text"
                        id="username"
                        value={temp_username.trim()}
                        onChange={(e) => setTempUsername(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;