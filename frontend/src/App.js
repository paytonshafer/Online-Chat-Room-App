import socketIO from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import './App.css';

const socket = socketIO.connect('http://localhost:4000');

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/' element={<Home socket={socket}/>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
