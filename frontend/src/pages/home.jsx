import React from 'react';
import { useUserContext } from '../context/UserContext'; // get username context

// login page
const Home = ({ socket }) => {
    const { username } = useUserContext();

    return(<h1>{username}'s home</h1>)
}

export default Home;