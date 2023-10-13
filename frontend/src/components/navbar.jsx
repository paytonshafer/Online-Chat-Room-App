import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext' // get user info context
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
MDBBtn,
MDBTooltip
} from 'mdb-react-ui-kit';

const NavBar = () => {
    const [showNav, setShowNav] = useState(false); // has to do with mobile or small screen
    const [activePage, setActivePage] = useState('home') // active page when loged in is initially home
    const { username, curRoom } = useUserContext(); // get username from user context
    const navigate = useNavigate()

    // fucntion for when home is clicked
    const goHome = () => {
        navigate('/home')
        setActivePage('home')
    }

    // function for when chat is clicked
    const goChat = () => {
        navigate('/chat')
        setActivePage('chat')
    }

    // function for when features is clicked
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
            {username
                ? <MDBNavbarNav className='ms-1'>
                    {activePage === 'home' 
                        ? <MDBNavbarLink active>Home</MDBNavbarLink> 
                        : <MDBNavbarLink onClick={goHome}>Home</MDBNavbarLink>}
                    {!curRoom
                        ? <MDBTooltip placement='bottom' tag='span' title='Join a Room to Unlock'><MDBNavbarLink disabled>Chat</MDBNavbarLink></MDBTooltip>
                        : activePage === 'chat' 
                            ? <MDBNavbarLink active>Chat</MDBNavbarLink> 
                            : <MDBNavbarLink onClick={goChat}>Chat</MDBNavbarLink>}
                    {activePage === 'features' 
                        ? <MDBNavbarLink active>Features</MDBNavbarLink> 
                        : <MDBNavbarLink onClick={goFeatures}>Features</MDBNavbarLink> }
                </MDBNavbarNav>
                : <MDBNavbarNav className='ms-1'>
                    <MDBTooltip tag='span' title='Login to Unlock'>
                        <div className='d-flex flex-row'>
                            <MDBNavbarLink disabled >Home</MDBNavbarLink>
                            <MDBNavbarLink disabled>Chat</MDBNavbarLink>
                            <MDBNavbarLink disabled>Features</MDBNavbarLink>
                        </div>
                    </MDBTooltip>
                </MDBNavbarNav>}
            {username
                ? <span className='navbar-text text-nowrap px-3'>{curRoom ? curRoom : <MDBTooltip placement='left' tag='span' title='Once you join a room from the home page, it will show up here.'>Join a Room!</MDBTooltip>}</span>
                : null}
            {username ? <MDBBtn outline color='danger' size='sm' type='button' className='me-3' style={{paddingRight:'18px'}} href='/'>EXIT</MDBBtn> : null}
            </MDBCollapse>
        </MDBContainer>
        </MDBNavbar>
    );
}

export default NavBar