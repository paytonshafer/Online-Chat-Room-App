import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate through pages
import { useUserContext } from '../context/UserContext'; // get username context
import {
MDBContainer,
MDBTabs,
MDBTabsItem,
MDBTabsLink,
MDBTabsContent,
MDBTabsPane,
MDBBtn,
MDBTooltip,
MDBIcon,
//MDBIcon, not needed yet
MDBInput,
//MDBCheckbox, not needed yet
}
from 'mdb-react-ui-kit'; // bootstrap react components
import { toast, ToastContainer } from 'react-toastify'; // toast messages
import "react-toastify/dist/ReactToastify.css";

// login page
const Login = ({ socket }) => {
    const [justifyActive, setJustifyActive] = useState('tab1') // state for which tab is showing
    const [tempUsername, setTempUsername] = useState('') // state for the username in the username feild
    const [usernameTaken, setUsernameTaken] = useState(false) // state for showing username taken message
    const navigate = useNavigate(); // initailize naviagtor
    const { setUsername, setUserRoomList, setGRooms } = useUserContext(); // get functions to set username, messages and userRooomList

    // styling for error message (for taken username)
    const error_style = {
        color: 'red',
        textAlign: 'center'
    }

    // function to handle switching between tabs
    const handleJustifyClick = (value) => {
        if (value === justifyActive) { // if value is the active one then ignore
        return;
        }

        setJustifyActive(value); // set the new tab
    };

    // function to handle login submition
    const handleSubmit = (e) => {
        e.preventDefault(); // prevent default

        if(tempUsername.trim() === ""){ // ensure blank or just spaces as username cant be submitted
            setTempUsername("")
        } else {
            socket.emit('request_users', {}, (userList) => {
                // check if username is already taken
                if(userList.map((str) => str.toLowerCase()).includes(tempUsername.toLowerCase())){
                    //setUsernameTaken(true) // show taken message No need to show anymore bc we added the taosts
                    setTempUsername("") // set username to blank (also clears input box)
                    toast.error('Username Taken, Try Again.', {
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
                    setUsername(tempUsername); // set username in context
                    socket.emit('req_user_room_list', {}, (data) => { // get user room list info
                        setUserRoomList(data)
                    })
                    socket.emit('req_rooms', {}, (data) => { // get list of available rooms
                        setGRooms(data)
                        navigate('/home'); // send user to the homepage
                    })
                    socket.emit("user_join", tempUsername); // send to server to broadcast that new user joined
                    setUsernameTaken(false) // reset usernmaeTaken field
                }
            })
        }
    }

    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
        
        <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
            <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                Login
            </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                Register
            </MDBTabsLink>
            </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>

            <MDBTabsPane show={justifyActive === 'tab1'}>

            {/* Option to sign in with other accounts like google and stuff - not needed yet
            <div className="text-center mb-3">
                <p>Sign in with:</p>

                <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='facebook-f' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='twitter' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='github' size="sm"/>
                </MDBBtn>
                </div>

                <p className="text-center mt-3">or:</p>
            </div>*/}
            <form onSubmit={handleSubmit}>
                <p style={error_style}>{usernameTaken ? "Username Taken Please Try Again" : ""}</p>  
                <MDBTooltip className='pt-0 mt-0' placement='right' tag='span' title={<p>Username Requirements<br/> <MDBIcon fas icon="greater-than-equal" /> 1 Character Long<br/>No Spaces<br/>Dont' Be Too Silly <MDBIcon far icon="grin-wink" /></p>}>
                    <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text' value={tempUsername.trim()} onChange={(e) => setTempUsername(e.target.value)}/>
                </MDBTooltip>
                <MDBInput wrapperClass='mb-4' label='Password (Not needed yet, just enter a username to login)' id='form1' type='password' disabled/>

                {/*
                <div className="d-flex justify-content-between mx-4 mb-4">
                    <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                    <a href="!#">Forgot password?</a>
                </div>
                */}

                <MDBBtn className="mb-4 w-100" type='submit' onClick={handleSubmit}>Sign in</MDBBtn>
                {/*<p className="text-center">Not a member? <a href="#!">Register</a></p>*/}
            </form>
            
            </MDBTabsPane>

            {/*Sign up pane below*/}
            <MDBTabsPane show={justifyActive === 'tab2'}>

            {/*
            <div className="text-center mb-3">
                <p>Sign up with:</p>

                <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='facebook-f' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='twitter' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='github' size="sm"/>
                </MDBBtn>
                </div>

                <p className="text-center mt-3">or:</p>
            </div>*/}

            <p>No need to sign up yet, please head to login page and enter a username to login</p>
            <MDBInput wrapperClass='mb-4' label='Name' id='form1' type='text' disabled/>
            <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text' disabled/>
            <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email' disabled/>
            <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password' disabled/>

            {/*
            <div className='d-flex justify-content-center mb-4'>
                <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' />
            </div>
            */}

            <MDBBtn className="mb-4 w-100" onClick={() => handleJustifyClick('tab1')}>Sign up</MDBBtn>

            </MDBTabsPane>

        </MDBTabsContent>

        <ToastContainer/>
        </MDBContainer>
    );
}

export default Login;