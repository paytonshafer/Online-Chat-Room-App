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
    MDBTooltip,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInput
} from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify'; // toast messages
import "react-toastify/dist/ReactToastify.css";

const NavBar = ( {socket} ) => {
    const [showNav, setShowNav] = useState(false); // has to do with mobile or small screen
    const [activePage, setActivePage] = useState('home') // active page when loged in is initially home
    const { username, curRoom, setUsername } = useUserContext(); // get username from user context
    const [basicModal, setBasicModal] = useState(false)
    const [newUsername, setNewUsername] = useState('')
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

    // function to toggle the modal
    const toggleShow = () => setBasicModal(!basicModal);

    // handle submit of new username
    const handleSubmit = (e) => {
        e.preventDefault()
        // if username is empty or same as before
        if(newUsername.trim() === '' || newUsername.trim().toLowerCase() === username.toLowerCase()){
            setNewUsername('') // clear feild
            toast.error('Please Enter a New Username', { // error msg
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        } else {
            socket.emit("request_users", {}, (userList) => { // check if username take by other user
                if(userList.map((str) => str.toLowerCase()).includes(newUsername.toLowerCase())){ // if the requested new username is taken
                    setNewUsername('') // clear username
                    toast.error('Username Taken, Try Again.', { // username taken msg
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    })
                } else { // if not reset their username and let current user and everyone know
                    socket.emit('changed_username', {old: username, new: newUsername}) // emit username change
                    setUsername(newUsername) // set username variable
                    toast.success(`Username changed to '${newUsername}'`, { // username change msg
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    })
                    setNewUsername('') // clear username
                }
            })
        }
    };

    return (
        <>
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
                            <MDBTooltip placement='right' tag='span' title='Click to Change Username'><MDBNavbarLink onClick={toggleShow} className='rounded-pill bg-light shadow-5'>Current Username<strong>:</strong> {username}</MDBNavbarLink></MDBTooltip>
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
            <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                    <MDBModalTitle>Update Username</MDBModalTitle>
                    <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <p className='my-0'><strong>Current Username: </strong>{username}</p> {/* Display current username */}
                        <p>Enter your new username and click "Save Changes" to update it.</p>
                        <MDBInput
                            label="New Username"
                            type="text"
                            value={newUsername.trim()}
                            onChange={(e) => setNewUsername(e.target.value)}
                            required
                        />
                    </MDBModalBody>
                    <MDBModalFooter>
                    <MDBBtn color='secondary' onClick={toggleShow}>
                        Close
                    </MDBBtn>
                    <MDBBtn onClick={handleSubmit}>Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            <ToastContainer/>
        </>
    );
}

export default NavBar