import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'; // navigate through pages
import {
MDBContainer,
MDBNavbar,
MDBNavbarBrand,
MDBNavbarToggler,
MDBNavbarNav,
MDBNavbarLink,
MDBIcon,
MDBCollapse,
MDBBtn
} from 'mdb-react-ui-kit';

const NavBar = () => {
    const [showNav, setShowNav] = useState(false);
    const [activePage, setActivePage] = useState('chat')
    const { username } = useUserContext(); // get username from user context
    const navigate = useNavigate()

    const goHome = () => {
        navigate('/home')
        setActivePage('home')
    }

    const goChat = () => {
        navigate('/chat')
        setActivePage('chat')
    }

    const goFeatures = () => {
        navigate('/features')
        setActivePage('features')
    }

    return (
        <MDBNavbar sticky expand='lg' light bgColor='light'>
        <MDBContainer fluid>
            <MDBNavbarBrand className='ms-3'>Chat With Friends</MDBNavbarBrand>
            <MDBNavbarToggler
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNav(!showNav)}
            >
            <MDBIcon icon='bars' fas />
            </MDBNavbarToggler>
            <MDBCollapse navbar show={showNav}>
            <MDBNavbarNav className='ms-1'>
                {username 
                ? activePage === 'home' 
                    ? <MDBNavbarLink active onClick={goHome}>Home</MDBNavbarLink> 
                    : <MDBNavbarLink onClick={goHome}>Home</MDBNavbarLink> 
                : <MDBNavbarLink disabled >Home</MDBNavbarLink>}
                {username 
                ? activePage === 'chat' 
                    ? <MDBNavbarLink active onClick={goChat}>Chat</MDBNavbarLink> 
                    : <MDBNavbarLink onClick={goChat}>Chat</MDBNavbarLink> 
                : <MDBNavbarLink disabled>Chat</MDBNavbarLink>}
                {username 
                ? activePage === 'features' 
                    ? <MDBNavbarLink active onClick={goFeatures}>Features</MDBNavbarLink> 
                    : <MDBNavbarLink onClick={goFeatures}>Features</MDBNavbarLink> 
                : <MDBNavbarLink disabled>Features</MDBNavbarLink>}
            </MDBNavbarNav>
            {username ? <MDBBtn outline color='danger' size='sm' type='button' className='me-3' href='/'>EXIT</MDBBtn> : null}
            </MDBCollapse>
        </MDBContainer>
        </MDBNavbar>
    );
}

export default NavBar