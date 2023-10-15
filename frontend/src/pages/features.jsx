import React, { useEffect, useState } from 'react';
import FeatureCards from '../components/helper/feature_cards';
import CommandList from '../components/helper/command_list';
import Footer from '../components/footer' //get footer
import { useUserContext } from '../context/UserContext'; // get username context

// feature page, this page is purely content as of 10/11/23
const Features = ({ socket }) => {
    const { setGMessages, gmessages } = useUserContext(); // get username to add some personalization
    const [messages, setMessages] = useState(gmessages) // message buffer for messages sent while not in chat

    // use effect on initial load that sets listeners
    useEffect(() => {
        // SOCKET.IO EVENT LISTENERS
        // setting what happens when chat_message is emitted
        socket.on("chat_message", (data) => {
            addMessage(data.sender + ": " + data.message); // add new message buffer
        })

        // setting what happens when user_join is emitted
        socket.on("user_join", (data) => {
            addMessage("System: " + data + " just joined the room!"); // add new user message
        })

        // setting what happens when user_leave is emitted
        socket.on("user_leave", (data) => {
            addMessage("System: " + data + " has left the room."); // add user left message
        })

        // annouce that another user changed their username
        socket.on('other_name_change', (data) => {
            addMessage("System: The user '" + data.old + "' changed their username to '" + data.new + "'.") // add user change name
        })

        // when we receive a direct message
        socket.on('receive_direct_message', (data) => {
            addMessage(data.sender + " (direct message): " + data.message) //add message to buffer and not that it is a direct message
        })
        
    }, [socket])

    // use effect to set global messages when messages update
    useEffect( () => {
        setGMessages(messages) // set global messages to messages when leave chat page
    }, [messages, setGMessages])

    // add message function to add new message to the buffer
    const addMessage = (data) => {
        setMessages((prev) => [...prev, data]) // add message to the end of the message buffer
    }

    return (
        <div>
            <FeatureCards />

            <CommandList />
            
            <Footer />
        </div>
    );
}

export default Features;