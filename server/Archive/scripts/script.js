const form = document.querySelector("form"); // get the form object
const input = document.querySelector(".input"); // get our input by its class name input
const messages = document.querySelector(".messages"); //get message buffer by class name messages
const socket = io(); // connect to the socket.io instance on the server (connection event on server side)
let username; // initalize username
let isInitialUserListRequested = false; // add a flag to track the inital userlist request
const helpMessage = `**Chat Room Help**

Welcome to the chat room! Here are some available commands to enhance your chat experience:
Note: Some commands have parametes, just type the command and the parameters seperated by spaces.

/help: Display this help message, listing available commands.
/users: List all connected users in the chat room.
/clear: Clear all messages on your screen.
/username: Change your username, you still must have a unique name.
/ai message: Send a message to the ai chat bot. (not complete yet)

Feel free to use these commands to explore and interact with the chat room. If you have any questions or need assistance, don't hesitate to ask!
Happy chatting! 🚀`; // help message to be displayed to user

// HELPER FUNCTIONS
// function to add a message to the message buffer
const addMessage = (message) => {
    const li = document.createElement("li"); //create new li elem
    li.innerText = message; // add message to be text in li
    messages.appendChild(li); // add message to the ul (message buffer)
    window.scrollTo(0, document.body.scrollHeight); // scroll to bottom of page so you can see all messages
}

// function to send data (for now just username) when disconnecting
const sendDataOnDisconnect = () => {
    // emit the client disconnect to let the others know what user left the room
    socket.emit("client_disconnect", {username: username});
    // disconnect from the server
    socket.disconnect();
}

//function to get inital user list, this is only ran on the start of the script
const fetchUserList = () => {
    return new Promise((resolve, reject) => { // create a promise so we dont have to worry about waiting for the data
        if (!isInitialUserListRequested) {  // check if the request has not been made yet
            isInitialUserListRequested = true; // set the flag to true
            
            // send request to get user list with the reason that is for inital list
            socket.emit('request_users', { reason: 1 });
            
            // this is getting the user list back, we want to store it in the promise and wait to use it
            socket.on("user_list_initial", (data) => {
                resolve(data);
            });
        }
    })
}

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

//helper function to handle all the commands using switch statement
const handleCommands = (cmd) => {
    switch (cmd) {
        case "help":
            // add below message to let the user know their command options
            addMessage(helpMessage)
            break
        case "users":
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
            break
        default:
            // only gets here if they tried to use a command that we don't have
            addMessage('System: Invalid command, please try again')
    }
}

// EVENT LISTENERS
// we add an event listener to the form for on the submit button 
form.addEventListener("submit", (event) => {
    event.preventDefault(); // prevent blank message from sending

    // this prevents a blank message coming up on the current user
    if(input.value.trim() !== "") {
        // call function to add a message to buffer (on current client)
        addMessage(username + ": " + input.value);
    }
    
    // check for commands and an empty prompt
    if(input.value[0] == "/"){
        // call function to handle the command and send the command called to the function
        handleCommands(input.value.slice(1))
    } else if(input.value.trim() !== "") { // this if prevents blank data sent to others
        // on submit also send to the socket with data to give to other clients
        socket.emit("chat_message", {
            sender: username,
            message: input.value
        });
    }

    // reset the message text and text box
    input.value = "";
});

// add an event listener to handle disconnect
window.addEventListener("beforeunload", () => {
    sendDataOnDisconnect();
});

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

// get the list of users by the user commands
socket.on("user_list_cmd", (data) => {
    let users = "The current users connected are: "
    data.forEach((user) => {
        users = user == username ? users + username + " (you), " : users + user + ", " // this adds (you) next to user that requested it
        //users = user == username ? users : users + user + ", " // this line makes it so the user who requested it doesnt show up
    })
    addMessage(users.replace(/, $/, ''))
})

// when they try to change username and fail since it is already taken
socket.on('change_username_fail', (data) => {
    let unavailable = "The current users connected are: "
    data.forEach((user) => { // format user list and add (current username) next to their name
        unavailable = user == username ? unavailable + username + " (current username), " : unavailable + user + ", "
    })
    addMessage('System: The username you requested is already taken by someone else. Please try again. \nThe list of unavailable usernames is: ' + unavailable.replace(/, $/, '') + '.')
})

// change username pass! 
socket.on('change_username_pass', (data) => {
    username = data // change username
    addMessage("System: You are now in the chat as '" + username  + "'."); // let them know it passed and they have new username
})

// annouce that another user changed their username
socket.on('other_name_change', (data) => {
    addMessage("System: The user '" + data.old + "' changed their username to '" + data.new + "'.")
})

// RUN ON INITIAL LOAD
// run function to get user list then create unique username for user
fetchUserList().then((user_list_on_connect) => {
    username = promptForUniqueUsername(user_list_on_connect); // get a unique username
    addMessage("System: You have joined the chat as '" + username  + "'. Send /help for a list of commands."); // add message when you join
    socket.emit("user_join", username); // send to server to broadcast that new user joined
});