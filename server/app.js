/*TODO:
UI Upgrades;
    Home page - welcome username, eventually room selection, for now single room connection, show users in room
    Chat page - current home page, no changes as of now
    Feature page - show available commands 
    Change in capitalization makes usernames different -> Payton vs payton, when check put all to lowercase
    Make system messages different color?
    Push messages toward center? -> increase outer margin
    tool tips?
env files for front and backend to hold port, weather run is dev or deploy, 
Set up some way to clear out logs
select what "room" to join -> set a room string and then socket.join(room), io.in(room).emit()
Integraete database to backend:
    choose db service and link up to backend
    store room history -> /history command to get history back
    store user into and credentials
    login systen
    profile icon
    friend list 
    user status (online or offline)
moderator/admin tools: mute user, delete messages -> do we need db for this? how to know a user is admin
add more commands:
    /me - allow users to set a description, allow others to get description
    /desc - get aboce descriptions ex. /desc username
    ignore messages from specific user
    game/riddle - launch text game in room
    cmds with api:
        /define - define a word
        chat with ai, ex /ai tell me about egyot -> pull prompt and send to gpt with ai
        get weather of given city
        get quote
*/
// import express which is a helper to ask act as web server
const express = require("express");
// import http module which allows to send http requests
const { createServer } = require('http');
// import server.io module that makes working with web sockets super easy
const { Server } = require("socket.io")
// import cors to ensure data can be sent between server and sockets
const cors = require('cors');
// require winston and needed functions for logging
const { createLogger, format, transports } = require('winston');


// set port, check for env file with specified port, if not there use 3000
const port = process.env.PORT || 8000;
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
        // add whitelist to allow more than 1 origin, add chloes ip
        //origin: "*" //uncomment and comment above to allow for any connection
    }
})

// initialize logger object to log to console and to app.log file
const logger = createLogger({
    level: 'info', // set the minimum log level to "info"
    format: format.combine(
        format.timestamp(), // get time stamp for log
        format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`; // create function to print in this format
        })
    ),
    transports: [ // set where logging will happen
        new transports.Console(), // log to the console
        new transports.File({ filename: 'app.log' }) // log to the log file
    ]
});

// create a map to store the usernames and their respective socket
const connectedClients = new Map()

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
    try {
        // create an event for when user joins and add then to list and let all connected users know
        socket.on("user_join", (data) => { // data is the new username
            try {
                if(data){ // unsure data is not null so only real users can be added
                        logger.info(data + ' joined (socket id: ' + socket.id + ')')
                        connectedClients.set(data, socket); // add new user and their socket to client list
                        // call user_join event and send the bew users username
                        socket.broadcast.emit("user_join", data);
                    }
            } catch (error) {
                logger.error("User join error for " + socket.id + " (" + data + ") :", error)
            }
        });

        // create an event when you send a message to send message to all other users
        socket.on("chat_message", (data) => { // data is username of sender and message
            try {
                // call chat_message event and send the message data (username of sender and message)
                socket.broadcast.emit("chat_message", data);
            } catch (error) {
                logger.error("Send chat message error for " + socket.id + " :", error)
            }
        });

        // create an event for the user on disconnect to let all other user know they left
        socket.on("disconnect", () => {
            try {            // get username from socket that left
                gone_user = getKeyByValue(connectedClients, socket)
                if(gone_user){
                    // log that the user left
                    logger.info(gone_user + ' left (socket id: ' + socket.id + ')')
                    // remove said user from the map
                    connectedClients.delete(gone_user)
                    // call user_leave event and send username of user who left
                    socket.broadcast.emit("user_leave", gone_user);
                }
            } catch (error) {
                logger.error("Disconnect error for " + socket.id + " :", error)
            }

        })

        // event for requesting user list that can be used with a callback function
        socket.on('request_users', (data, callback) => {
            // send username list back
            callback([...connectedClients.keys()])
        })

        // craete event for when someone wants to change their username they request here
        socket.on('changed_username', (data) => { // data has old and new username
            try{
                connectedClients.delete(data.old) // delete old username
                connectedClients.set(data.new, socket) // add new username
                socket.broadcast.emit('other_name_change', data) // broadcast to all other users
                logger.info(data.old + ' changed username to ' + data.new + ' (socket id: ' + socket.id + ')') // log that a user changed their name
            } catch (error) {
                logger.error("Change username error for " + socket.id + " :", error)
            }
        })

        // event for when you send a direct message to only one user
        socket.on('send_direct_message', (data) => { // data has sender, receiver and the message
            try {
                receiver_socket = connectedClients.get(data.receiver) // get receiver socket
                receiver_socket.emit("receive_direct_message", data) // send direct message to the socket
            } catch (error) {
                logger.error("Send direct message error for " + socket.id + " :", error)
            }
        })
    } catch (error) {
        logger.error("Connection setup error:", error);
    }
});

// we ensure that the http server is listening on given port, if it is we output where it is listening
server.listen(port, () => {
    logger.info("Listening on port:" + port); // log that startup was successful
});

// handle server startup errors
server.on('error', (error) => {
    // log the error if it happens.
    logger.error('Server startup error:', error);
});

/*
NOTES ON SOCKET.IO
.on method sets an event listener that lisentens for event in "" and executes function when it hears it
.emit method activates that event, on user sends to server and on server sends to user
socket.broadcast.emit emits the event to all users but the socket that is calling it
socket.emit sends it only to the socket that is calling it (the socket object)
on server side alwasys start with connection and inside you set the event listeners you want
*/