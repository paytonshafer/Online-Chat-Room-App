import React from 'react';
import Footer from '../components/footer'
import { useUserContext } from '../context/UserContext'; // get username context

/*
Welcome
Jumbotron idrk
room selection
maybe carasol
*/


// login page
const Home = ({ socket }) => {
    const { username } = useUserContext();

    return(
        <div>
            <h1>{username}'s header</h1>
            <h1>Info on app</h1>
            <h1>Room selection</h1>
            <h1>If extra content add carosol or something</h1>
            <Footer />
        </div>
        
    )
}

export default Home;