import socketIO from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar';
import Login from './pages/login';
import Chat from './pages/chat'
import Home from './pages/home'
import Features from './pages/features';
import { UserProvider } from './context/UserContext';

const socket = socketIO.connect(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`)
//const socket = socketIO.connect('http://192.168.4.26:8000'); //uncomment this to allow others to connect to the socket (chloe home network)

function App() {
    return (
        <div className="bg-white">
            <Router>
                <UserProvider>
                    <NavBar socket={socket}/>
                    <Routes>
                        <Route path='/' element={<Login socket={socket}/>}></Route>
                        <Route path='/chat' element={<Chat socket={socket}/>}></Route>
                        <Route path='/home' element={<Home socket={socket}/>}></Route>
                        <Route path='/features' element={<Features socket={socket}/>}></Route>
                    </Routes>
                </UserProvider>
            </Router>
        </div>
    );
}

export default App;
