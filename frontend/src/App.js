import socketIO from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home'
import NavBar from './components/navbar';
import { UserProvider } from './context/UserContext';

const socket = socketIO.connect('http://localhost:8000');
//const socket = socketIO.connect('http://192.168.4.26:8000'); //uncomment this to allow others to connect to the socket (chloe home network)

function App() {
    return (
        <div className="bg-white">
            <Router>
                <UserProvider>
                    <NavBar/>
                    <Routes>
                        <Route path='/' element={<Login socket={socket}/>}></Route>
                        <Route path='/home' element={<Home socket={socket}/>}></Route>
                    </Routes>
                </UserProvider>
            </Router>
        </div>
    );
}

export default App;
