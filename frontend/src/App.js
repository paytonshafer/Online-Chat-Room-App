import socketIO from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home'
import { UserProvider } from './context/UserContext';
import './App.css';

const socket = socketIO.connect('http://localhost:8000');

function App() {
    return (
        <div className="App">
            <Router>
                <UserProvider>
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
