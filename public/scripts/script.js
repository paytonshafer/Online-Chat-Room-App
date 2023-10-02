const form = document.querySelector("form"); // get the form object
const input = document.querySelector(".input"); // get our input by its class name input
const messages = document.querySelector(".messages"); //get message buffer by class name messages
const socket = io(); // connect to the socket.io instance on the server (connection event on server side)
let username; // initalize username
let isInitialUserListRequested = false; // add a flag to track the inital userlist request

// HELPER FUNCTIONS
// function to add a message to the message buffer
const addMessage = (message) => {
    const li = document.createElement("li"); //create new li elem
    li.innerHTML = message; // add message to be text in li
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

const handleCommands = (cmd) => {
    switch (cmd) {
        case "help":
            // add below message to let the user know their command options
            addMessage('Every command must start with the "!". The current command list: help, users')
            break
        case "users":
            // get user list and set reason to be for it to print out
            socket.emit("request_users", {reason: 0})
            break
        default:
            // only gets here if they tried to use a command that we don't have
            addMessage('What you entered is not a valid command, please try again')
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
    if(input.value[0] == "!"){
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

socket.on("user_list_cmd", (data) => {
    let users = "The current users connected are: "
    data.forEach((user) => {
        users = user == username ? users + username + " (you), " : users + user + ", " // this adds (you) next to user that requested it
        //users = user == username ? users : users + user + ", " // this line makes it so the user who requested it doesnt show up
    })
    addMessage(users.replace(/, $/, ''))
})

// RUN ON INITIAL LOAD
// run function to get user list then create unique username for user
fetchUserList().then((user_list_on_connect) => {
    username = promptForUniqueUsername(user_list_on_connect); // get a unique username
    addMessage("You have joined the chat as '" + username  + "'. Send !help for a list of commands."); // add message when you join
    socket.emit("user_join", username); // send to server to broadcast that new user joined
});