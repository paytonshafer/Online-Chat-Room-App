import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate through pages
import { useUserContext } from '../context/UserContext'; // get username context

// login page
const Login = ({ socket }) => {
    const [username, setUsername] = useState(''); // set state for username
    const navigate = useNavigate(); // initailize naviagtor
    const { login } = useUserContext(); // get login function to set the username in the context

    // function to handle username submission
    const handleLogin = (e) => {
        e.preventDefault(); // prevent default
        //TODO add unique username logic
        login(username); // set username in context
        navigate('/home'); // send user to the homepage
    };

    return (
        <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                value={username}
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