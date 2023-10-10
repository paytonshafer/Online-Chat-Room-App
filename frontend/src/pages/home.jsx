import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate through pages
import { useUserContext } from '../context/UserContext'; // get user info through context
import { MDBBtn, MDBInput, MDBCard, MDBCardHeader, MDBCardBody, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit'; 

// home page, for now this is where the chat is
const Home = ({ socket }) => {
    const helpMessage = `System: **Chat Room Help**<br /><br />

    Welcome to the chat room! Here are some available commands to enhance your chat experience:<br />
    Note: Some commands have parameters; just type the command and the parameters separated by spaces.<br /><br />
    
    /help: Display this help message, listing available commands.<br />
    /users: List all connected users in the chat room.<br />
    /clear: Clear all messages on your screen.<br />
    /username new_username: Change your username to new_username, but username must still be unique.<br />
    /direct other_user message: Send a direct message to only other_user. <br /><br />
    
    Feel free to use these commands to explore and interact with the chat room.<br />
    Happy chatting! 🚀`; // help message to be displayed to user
    const { id, username, setUsername } = useUserContext(); // get username from user context, setUsername function to set username
    const messagesEndRef = useRef(null); // useRef to use as a ref to scroll to bottom of message buffer
    const [message, setMessage] = useState('') // message state of current message in input
    const [messages, setMessages] = useState(["System: You have joined the chat as '" + username  + "'. Send /help for a list of commands."]) // message bufer with initial message
    const navigate = useNavigate(); // initailize naviagtor

    // use effect on initial load that sets listeners
    useEffect(() => {
        // SOCKET.IO EVENT LISTENERS
        // setting what happens when chat_message is emitted
        socket.on("chat_message", (data) => {
            addMessage(data.sender + ": " + data.message); // add new message buffer
        })

        // setting what happens when user_join is emitted
        socket.on("user_join", (data) => {
            addMessage("System: " + data + " just joined the chat!"); // add new user message
        })

        // setting what happens when user_leave is emitted
        socket.on("user_leave", (data) => {
            addMessage("System: " + data + " has left the chat."); // add user left message
        })

        // annouce that another user changed their username
        socket.on('other_name_change', (data) => {
            addMessage("System: The user '" + data.old + "' changed their username to '" + data.new + "'.") // add user change name
        })

        // when we receive a direct message
        socket.on('receive_direct_message', (data) => {
            addMessage(data.sender + " (direct message): " + data.message) //add message to buffer and not that it is a direct message
        })

        return () => {
            // socket clean up
            socket.disconnect();
        }
    }, [socket])

    // use effect to ensure that if there is no username you will be directed to login
    useEffect(() => {
        if(!username){ // if username is null send to login
            navigate('/')
        }

        return () => {
            // socket clean up if the username is null
            if(!username){
                socket.disconnect();c
            }
        }
    }, [username, navigate, socket])

    // this is to ensure the newest message is visible once it is added to the screen
    useEffect(() => {
        // function to scroll to the last message
        const scrollToBottom = () => {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        };
    
        // call scrollToBottom whenever a new message is added to scroll to the latest message
        scrollToBottom();
    }, [messages]) // run this when messages is changed

    // add message function to add new message to the buffer
    const addMessage = (data) => {
        setMessages((prev) => [...prev, data]) // add message to the end of the message buffer
    }

    // helper function to handle commands that are passed through
    const handleCommands = (cmd_and_params) => {
        const cmd_params_list = cmd_and_params.split(" ") // get list of command used and params
        const cmd = cmd_params_list[0] // get command used
        const params = cmd_params_list.slice(1) // get param list
        switch (cmd) {
            case "help":
                // add below message to let the user know their command options
                addMessage(helpMessage)
                break
            case "users":
                // get user list and print it out in message buffer
                socket.emit("request_users", {}, (userList) => {
                    let users = "System: The current users connected are: "
                    userList.forEach((user) => {
                        users = user === username ? users + username + " (you), " : users + user + ", " // this adds (you) next to user that requested it
                        //users = user == username ? users : users + user + ", " // this line makes it so the user who requested it doesnt show up
                    })
                    addMessage(users.replace(/, $/, ''))
                })
                break
            case "clear":
                setMessages([]) // clear buffer
                addMessage("System: You are in the chat as '" + username  + "'. Use /help for help and a list of commands."); // add at top so they know how to get help and current username
                break
            case "username":
                // set new username
                let new_username = params[0] // get new username as first cmd
                if(!new_username){
                    addMessage('System: You did not enter a new username. Please try again.')
                    break
                }
                if(new_username === username){ // check if username is same as old
                    addMessage('System: The username you entered is your current username. Please try again with a new username.')
                    break
                }
                // if not ask server for list of connected users
                socket.emit("request_users", {}, (userList) => {
                    if(userList.includes(new_username)){ // if the requested new username is taken
                        let unavailable = "The current users connected are: "
                        userList.forEach((user) => { // format user list and add (current) next to their name
                            unavailable = user === username ? unavailable + username + " (current), " : unavailable + user + ", "
                        })
                        addMessage('System: The username you requested is already taken by someone else. Please try again. \nThe list of unavailable usernames is: ' + unavailable.replace(/, $/, '') + '.')
                    } else { // if not reset their username and let current user and everyone know
                        socket.emit('changed_username', {old: username, new: new_username}) // emit username change
                        setUsername(new_username) // set username variable
                        addMessage("System: You are now in the chat as '" + new_username  + "'."); // let them know it passed and they have new username
                    }
                })
                break
            case "direct":
                let other_user = params[0] // get other user
                let message = params.slice(1).join(' ') // get message and repair to whole string with spaces

                if(other_user === username){ // check if other_user is you
                    addMessage('System: The username you entered is your own username. You can not send a direct message to yourself.')
                    break
                }

                // since other_user is not you, get user list to check if they exist
                socket.emit("request_users", {}, (userList) => {
                    if(userList.includes(other_user)){ // if the other user exits
                        socket.emit("send_direct_message", {sender: username, receiver: other_user, message: message}) // send message
                        // do I want to add confirmation message?
                    } else {
                        // otherwise tell user that the user they want to send to doesnt exist
                        addMessage("System: Unable to send message because a user named '" + other_user + "' does not exist. Use '/users' to get a list of current users in the room.")
                    }
                })
                break
            default:
                // only gets here if they tried to use a command that we don't have
                addMessage('System: Invalid command, please try again')
        }    }

    // function to handle message send
    const handleSend = (event) => {
        event.preventDefault()

        // if the message is not empty add it to personal buffer
        if(message.trim() !== "") {
            addMessage(id + username + ': ' + message)
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
            <ul className="p-0 m-0 mt-2 mb-8">
                <MDBContainer className='mx-6 p-0'>
                {messages.map((data, index) => (
                    data.split(': ')[0].includes(id) // if the message is sent by the current user diff style
                    ?
                    <MDBRow end key={index} style={{marginLeft: '20rem'}}>
                        <MDBCol md='auto' className='m-0'>
                            <MDBCard background='primary' shadow='1' className='my-1' style={{color: 'white'}}>
                                <MDBCardHeader className='p-0 p-2 text-end' >{data.split(': ')[0].slice(10)}</MDBCardHeader>
                                {username.length >=  data.split(': ').slice(1).join(': ').length ?
                                <MDBCardBody className='p-2 text-end'><div dangerouslySetInnerHTML={{ __html: data.split(': ').slice(1).join(': ') }}></div></MDBCardBody> :
                                <MDBCardBody className='p-2'><div dangerouslySetInnerHTML={{ __html: data.split(': ').slice(1).join(': ') }}></div></MDBCardBody>}
                            </MDBCard>
                        </MDBCol>
                    </MDBRow> 
                    :
                    <MDBRow start key={index} style={{marginRight: '20rem'}}>
                    <MDBCol md='auto' className='m-0'>
                            <MDBCard background='secondary' shadow='1' className=' my-1' style={{color: 'white'}}>
                                <MDBCardHeader className='p-0 p-2' >{data.split(': ')[0]}</MDBCardHeader>
                                <MDBCardBody className='p-2'><div dangerouslySetInnerHTML={{ __html: data.split(': ').slice(1).join(': ') }}></div></MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                ))}
                </MDBContainer>
                {/* Use the ref to scroll to the last message */}
                <div ref={messagesEndRef}></div>
            </ul>
            <form onSubmit={handleSend}>
                <div className='fixed-bottom w-100 bg-white '>
                <div className='d-flex flex-row py-3 mx-3'>
                    <MDBInput 
                        type="text"
                        label="Write message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <MDBBtn className="ripple ripple-surface ripple-surface-light btn btn-primary w-25" type='submit' onClick={handleSend}>Send</MDBBtn>
                </div>
                </div>
            </form>
        </div>
    );
}

export default Home