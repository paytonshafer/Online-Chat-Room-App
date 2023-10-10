import React from 'react';
import { useUserContext } from '../context/UserContext'; // get username context

// login page
const Features = ({ socket }) => {
    const { username } = useUserContext();

    return(<h1>{username}'s features</h1>)
}

export default Features;