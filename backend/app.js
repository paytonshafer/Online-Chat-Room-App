/*TODO:
Upgrade UI -> create react app
    when a user leaves, it does not broadcast the disconnect
    /user function -> get list of connected users
    ensure distinct usernames
    /username -> change username with fail, pass and when another user does it
    /clear command
Update readme
Integrate database to backend
add more commands:
    /me - allow users to set a description, allow others to get description
    /desc - get aboce descriptions ex. /desc username
    chat with ai, ex /ai tell me about egyot -> pull prompt and send to gpt with ai
    get weather, 
    get rand quote, 
    ignore messages from specific user
    send message to a single user
    game/riddle - launch text game in room
    /define - define a word when 
login systen
profile icon
friend list 
user status (online or offline)
select what "room" to join or dm someone
integrate database to save previous messages in a room -> /history command to get history back
moderation tools:mute user, delete messages
*/
// import express which is a helper to ask act as web server
const express = require("express");
// import http module which allows to send http requests
const { createServer } = require('http');
// import server.io module that makes working with web sockets super easy
const { Server } = require("socket.io")
// import cors to ensure data can be sent between server and sockets
const cors = require('cors');

// 'constructor' of express module, we use app for everything now
const app = express();
// set up cors for app
app.use(cors());
// create http server using the express app
const server = createServer(app);
// create io instance of socket.io server and add cors route
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

// set port, check for env file with specified port, if not there use 3000
const port = process.env.PORT || 8000;
// create a map to store the usernames and their respective socket
const connectedClients = new Map()

/* migrated to react app so no longer need to server the html file here
// serve static files from the public directory
app.use(express.static(__dirname + "/public"));

// on the request to the url / return the index.html file as the page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html"); //send the html file
});
*/

// Helper Functions
// function to get the value of a map by the key, returns null if client isnt found
const getKeyByValue = (map, targetValue) => {
    for (const [key, value] of map.entries()) {
      if (value === targetValue) {
        return key;
      }
    }
    // If the target value is not found, you can return null or handle it as needed.
    return null;
  }

// on connection event create these event listeners on the new socket
io.on("connection", (socket) => {
    // create an event for when user joins and add then to list and let all connected users know
    socket.on("user_join", (data) => { // data is the new username
        if(data){ // unsure data is not null so only real users can be added
            console.log(data + ' joined (socket id: ' + socket.id + ')')
            connectedClients.set(data, socket); // add new user and their socket to client list
            // call user_join event and send the bew users username
            socket.broadcast.emit("user_join", data);
        }
    });

    // create an event when you send a message to send message to all other users
    socket.on("chat_message", (data) => { // data is username of sender and message
        // call chat_message event and send the message data (username of sender and message)
        socket.broadcast.emit("chat_message", data);
    });

    // create an event for the user on disconnect to let all other user know they left
    socket.on("disconnect", () => {
        // get username from socket that left
        gone_user = getKeyByValue(connectedClients, socket)
        if(gone_user){
            // log that the user left
            console.log(gone_user + ' joined (socket id: ' + socket.id + ')')
            // remove said user from the map
            connectedClients.delete(gone_user)
            // call user_leave event and send username of user who left
            socket.broadcast.emit("user_leave", gone_user);
        }
    })

    // create event to request a list of requested users and send back to same user
    socket.on('request_users', (data) => { // data contains the reason for request, 0 is to print user list and 1 is to get on login
        if(data.reason == 0){
            // call event user_list_cmd and send the username list with it to be printed
            socket.emit("user_list_cmd", [...connectedClients.keys()])
        } else if(data.reason == 1){
            // here we send the user list, this is onlh emitted on first loading
            socket.emit("user_list_initial", [...connectedClients.keys()])
        }
        // NOTE: add .filter((item) => {item !== null}) after the returned array if a null shows up in the client list
    })

    // craete event for when someone wants to change their username they request here
    socket.on('change_username_req', (data) => { // data has old and new username
        if(connectedClients.has(data.new)){ // if username is in the client list
            socket.emit('change_username_fail', [...connectedClients.keys()]) // send back failed along with current user list
        } else {
            connectedClients.delete(data.old) // delete old username
            connectedClients.set(data.new, socket) // add new username
            socket.emit('change_username_pass', data.new) // send back pass with new username
            socket.broadcast.emit('other_name_change', data) // broadcast to all other users
        }
    })
});

// we ensure that the http server is listening on given port, if it is we output where it is listening
server.listen(port, () => {
    console.log("Listening on port:" + port);
});

/*
NOTES ON SOCKET.IO
.on method sets an event listener that lisentens for event in "" and executes function when it hears it
.emit method activates that event, on user sends to server and on server sends to user
socket.broadcast.emit emits the event to all users but the socket that is calling it
socket.emit sends it only to the socket that is calling it (the socket object)
on server side alwasys start with connection and inside you set the event listeners you want
*/