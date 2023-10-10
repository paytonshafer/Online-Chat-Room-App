import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext'
import {
MDBContainer,
MDBNavbar,
MDBNavbarBrand,
MDBNavbarToggler,
MDBNavbarNav,
MDBNavbarLink,
MDBIcon,
MDBCollapse
} from 'mdb-react-ui-kit';

const NavBar = () => {
const [showNav, setShowNav] = useState(false);
const { username } = useUserContext(); // get username from user context

return (
    <MDBNavbar sticky expand='lg' light bgColor='light'>
    <MDBContainer fluid>
        <MDBNavbarBrand href='#'>Chat With Friends</MDBNavbarBrand>
        <MDBNavbarToggler
        aria-expanded='false'
        aria-label='Toggle navigation'
        onClick={() => setShowNav(!showNav)}
        >
        <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar show={showNav}>
        <MDBNavbarNav>
            {username ? <MDBNavbarLink href='#'>{/* active aria-current='page' */}Home</MDBNavbarLink> : <MDBNavbarLink disabled href='#'>{/* active aria-current='page' */}Home</MDBNavbarLink>}
            <MDBNavbarLink disabled href='#'>Features</MDBNavbarLink>
            {username ? <MDBNavbarLink href='/'>Logout</MDBNavbarLink> : <MDBNavbarLink disabled href='/'>Logout</MDBNavbarLink>}
            {/* <MDBNavbarLink disabled tabIndex={1} aria-disabled='true' href='#'> tabIndex={1} aria-disabled='true' 
            Disabled
            </MDBNavbarLink>*/}
        </MDBNavbarNav>
        </MDBCollapse>
    </MDBContainer>
    </MDBNavbar>
);
}

export default NavBar