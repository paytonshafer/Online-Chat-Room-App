/*TODO:
PUBLISH TO GITHUB
add more commands:
    /me - allow users to set a description, allow others to get description
    /desc - get aboce descriptions ex. /desc username
    chat with ai, ex /ai tell me about egyot -> pull prompt and send to gpt with ai
    get weather, 
    get rand quote, 
    ignore messages from specific user
    send message to a single user
    game/riddle - launch text game in room
    /define - define a word when asked
Upgrade UI (maybe make react)
login systen
friend list
user status (online or offline)
select what "room" to join or dm someone
integrate database to save previous messages in a room
moderation tools:mute user, delete messages

Features:
No blank messages
Everyone must have unique username
Commands: get current users and get list of commands
*/
// import express which is a helper to ask act as web server
const express = require("express");
// import http module which allows to send http requests
const { createServer } = require('http');
// import server.io module that makes working with web sockets super easy
const { Server } = require("socket.io")

// 'constructor' of express module, we use app for everything now
const app = express();
// create http server using the express app
const server = createServer(app);
// create io instance of socket.io server
const io = new Server(server)

// set port, check for env file with specified port, if not there use 3000
const port = process.env.PORT || 3000;
// create a map to store the usernames and their respective socket
const connectedClients = new Map()

// serve static files from the public directory
app.use(express.static(__dirname + "/public"));

// on the request to the url / return the index.html file as the page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html"); //send the html file
});

// on connection event create these event listeners on the new socket
io.on("connection", (socket) => {
    // create an event for when user joins and add then to list and let all connected users know
    socket.on("user_join", (data) => { // data is the new username
        if(data){ // unsure data is not null so only real users can be added
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
    socket.on("client_disconnect", (data) => { // data is username of user who left
        connectedClients.delete(data.username)
        // call user_leave event and send username of user who left
        socket.broadcast.emit("user_leave", data.username);
    });

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
            io.emit('change_username_pass', data.new) // send back pass with new username
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