import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext'; // get user info through context
import './styles/home.css'

const Home = ({ socket }) => {
    const helpMessage = `**Chat Room Help**

    Welcome to the chat room! Here are some available commands to enhance your chat experience:<br />
    Note: Some commands have parameters; just type the command and the parameters separated by spaces.<br /><br />
    
    /help: Display this help message, listing available commands.<br />
    /users: List all connected users in the chat room.<br />
    /clear: Clear all messages on your screen.<br />
    /username: Change your username; you still must have a unique name.<br />
    /ai message: Send a message to the AI chat bot. (not complete yet)<br /><br />
    
    Feel free to use these commands to explore and interact with the chat room. If you have any questions or need assistance, don't hesitate to ask!<br />
    Happy chatting! 🚀`; // help message to be displayed to user
    const [message, setMessage] = useState('') // message state of current message
    const [messages, setMessages] = useState([]) // message bufer
    const { username } = useUserContext(); // get username from user context

    useEffect(() => {
        /* REMOVE THIS AND MOVE LOGIC TO LOGIN PAGE
        // function to get a unique username for the user on join when they try to create a username
        const promptForUniqueUsername = (user_list_on_connect) => {
            let username = prompt("Please enter a username:"); // set inital username
            
            // if the chosen username is already taken
            if (user_list_on_connect.includes(username)) {
                alert("That username is already taken. Please choose another one.");
                return promptForUniqueUsername(user_list_on_connect); // recursivly ask again for a new username
            } else {
                return username; // return the unique username
            }
        }

        setUsername(promptForUniqueUsername(['payton']))
        */
        addMessage("System: You have joined the chat as '" + username  + "'. Send /help for a list of commands."); // add message when you join
        socket.emit("user_join", username); // send to server to broadcast that new user joined

        // SOCKET.IO EVENT LISTENERS
        // setting what happens when chat_message is emitted
        socket.on("chat_message", (data) => {
            addMessage(data.sender + ": " + data.message);
        });

        // setting what happens when user_join is emitted
        socket.on("user_join", (data) => {
            addMessage(data + " just joined the chat!");
        });

        // setting what happens when user_leave is emitted
        socket.on("user_leave", (data) => {
            addMessage(data + " has left the chat.");
        });

        return () => {
            // emit the client disconnect to let the others know what user left the room
            socket.emit("client_disconnect", {username: username});
            // disconnect from the server
            socket.disconnect();
        }
    }, [username, socket])

    // add message function to add new message to the buffer
    const addMessage = (data) => {
        setMessages((prev) => [...prev, data]) // add message to the end of the message buffer
        window.scrollTo(0, document.body.scrollHeight); // scroll to bottom of page so you can see all messages
    }

    // helper function to handle commands that are passed through
    const handleCommands = (cmd) => {
        switch (cmd) {
            case "help":
                // add below message to let the user know their command options
                addMessage(helpMessage)
                break
            /*case "users":
                // get user list and set reason to be for it to print out
                socket.emit("request_users", {reason: 0})
                break
            case "clear":
                messages.innerHTML = ""; // clear buffer
                addMessage("System: You are in the chat as '" + username  + "'. Use /help for help and a list of commands."); // add at top so they know how to get help
                break
            case "username":
                // get new username
                let new_username = prompt('Please enter a new username:')
                if(new_username == username){ // check if username is same as old
                    addMessage('System: The username you entered is your current username. Please try again.')
                    break
                }
                // if not ask server to check if it is a valid username and wait for response
                socket.emit("change_username_req", {new: new_username, old: username})
                break*/
            default:
                // only gets here if they tried to use a command that we don't have
                addMessage('System: Invalid command, please try again')
        }
    }

    // function to handle message send
    const handleSend = (event) => {
        event.preventDefault()

        // if the message is not empty add it to personal buffer
        if(message.trim() !== "") {
            addMessage(username + ': ' + message)
        }

        // check for commands and an empty prompt
        if(message[0] === "/"){
            // call function to handle the command and send the command called to the function
            handleCommands(message.slice(1))
        } else if(message.trim() !== "") { // this if prevents blank data sent to others
            // on submit also send to the socket with data to give to other clients
            socket.emit("chat_message", {
                sender: username,
                message: message
            });
        }

        setMessage('') // set message back to blank
    }

    return (
        <div>
            <title>Real-time Chat App</title>
            <meta
                name="viewport"
                content="width=device-width,minimum-scale=1,initial-scale=1"
            />
            <h1>Chat Room</h1>
            <ul className="messages">
                {messages.map((data, index) => (
                    <li key={index}>
                        <div dangerouslySetInnerHTML={{ __html: data }}></div>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSend}>
                <input 
                    type="text"
                    placeholder="Write message"
                    className="input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button>Send</button>
            </form>
        </div>
    );
}

export default Home
