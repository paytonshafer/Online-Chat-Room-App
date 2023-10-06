# Chat Room Application

## Overview
This is a chat room application built using React.js, Node.js, Express, and Socket.io. It allows users to join chat rooms, send messages, view the list of connected users, and other commands the user can see with the `/help` command or below. The application supports basic commands to enhance the chat experience.

## Features
- Join chat rooms with unique usernames.
- Send and receive real-time messages.
- Change username while ensureing everyone has a unique name.
- Basic command support (e.g., /help, /users, /clear).

## Getting Started

### Prerequisites
- Node.js and npm installed on your system.
- A code editor (e.g., Visual Studio Code) for editing the source code.

### Installation
1. Clone this repository to your local machine:

   ```
   git clone https://github.com/paytonshafer/Online-Chat-Room-App.git
   ```

2. Navigate to the project directory:

   ```
   cd Online-Chat-Room-App
   ```

3. Navigate to the frontend directory:

   ```
   cd frontend
   ```

4. Install the required dependencies:

   ```
   npm install
   ```

5. Navigate to the server directory:

   ```
   cd ../server
   ```

6. Install the required dependencies:

   ```
   npm install
   ```

### Usage

1. Start the application from the server directory (this will start the frontend and the backend):

   ```
   npm start
   ```

2. Open a web browser and go to [http://localhost:3000](http://localhost:3000) to access the chat room.

3. Enter your desired username when prompted.

4. Start chatting with other users by typing messages in the input field and pressing enter.

### Commands
- Use `/help` to display a list of available commands and their descriptions.
- Use `/users` to list all connected users in the chat room.
- Use `/clear` to clear all the messages on your screen.
- Use `/username new_username` to change user username to new_username if new_username is not taken by anyone else in the room.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Special thanks to the React.js, Node.js, Express, and Socket.io communities for their excellent libraries.