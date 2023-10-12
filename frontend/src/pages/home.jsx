import React, { useState } from 'react';
import Footer from '../components/footer'
import { useUserContext } from '../context/UserContext'; // get username context
import Select from 'react-select'
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardHeader,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBBtn,
    MDBInput
  } from 'mdb-react-ui-kit';
/*
Welcome, how to use, other idrk
    add content: welcome message, how to use (enter room, creatre room, feature page), other (link to source code, about the author?)
room selection
Show who is in what room in a card with tabs for each room
    map users from rooms to tabs
*/


// login page
const Home = ({ socket }) => {
    const { username } = useUserContext();
    const [justifyActive, setJustifyActive] = useState('tab1') // state for which tab is showing
    const [usersActive, setUsersActive] = useState('tab1') // state for which tab is showing
    const [roomSelector, setRoomSelector] = useState('')
    const [newRoom, setNewRoom] = useState('')
    const [availableRooms, ] = useState([
        { value: 'Room1',label: 'Room1' },
        { value: 'Room2', label: 'Room2' },
        { value: 'Room3', label: 'Room3' }
    ])

    // function to handle switching between tabs
    const handleJustifyClick = (value) => {
        if (value === justifyActive) { // if value is the active one then ignore
        return;
        }

        setJustifyActive(value); // set the new tab
    };

    // function to handle switching between tabs
    const handleUsersClick = (value) => {
        if (value === usersActive) { // if value is the active one then ignore
        return;
        }

        setUsersActive(value); // set the new tab
    };

    return(
        <div>
            <MDBCard className='text-center m-3'>
                <MDBCardHeader>
                    <MDBTabs className='card-header-tabs'>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                        Welcome
                        </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                        How to Chat
                        </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('tab3')} active={justifyActive === 'tab3'}>
                        More
                        </MDBTabsLink>
                    </MDBTabsItem>
                    </MDBTabs>
                </MDBCardHeader>
                <MDBCardBody>
                    <MDBTabsContent>
                        <MDBTabsPane show={justifyActive === 'tab1'}>
                            <MDBCardTitle>Welcome {username}</MDBCardTitle>
                        </MDBTabsPane>
                        <MDBTabsPane show={justifyActive === 'tab2'}>
                            <MDBCardTitle>Hello {username}</MDBCardTitle>
                        </MDBTabsPane>
                        <MDBTabsPane show={justifyActive === 'tab3'}>
                            <MDBCardTitle>Bye {username}</MDBCardTitle>
                        </MDBTabsPane>
                    </MDBTabsContent>
                </MDBCardBody>
            </MDBCard>

            <MDBCard className='text-center m-5'>
                <MDBCardHeader>
                    <strong>Explore Existing Rooms or Create a New One</strong>
                </MDBCardHeader>
                <div className='d-flex flex-row justify-content-around'>
                    <MDBCardBody className='d-flex flex-column align-items-center'>
                        <MDBCardTitle>Room Selection</MDBCardTitle>
                        <MDBCardText >
                            Choose an existing chat room from the list below to join a conversation with other users.
                        </MDBCardText>
                        <MDBCard className='w-40'>
                            <MDBCardBody className='d-flex flex-row justify-content-center'>
                                <div style={{width: '20rem'}}>
                                    <Select className='m-4' menuPlacement="auto" menuPosition="fixed" options={availableRooms} onChange={(e) => {setRoomSelector(e.value)}}/>
                                </div>
                                <MDBBtn className='m-4' onClick={() => {console.log(roomSelector)}}>Enter Room</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCardBody>
                    <div className="vr-blurry"></div>
                    <MDBCardBody className='d-flex flex-column align-items-center'>
                        <MDBCardTitle>Room Creation</MDBCardTitle>
                        <MDBCardText>Enter a unique room name and start a new chat room below!</MDBCardText>
                        <MDBCard className='w-75'>
                            <MDBCardBody >
                                <MDBInput value={newRoom.trim()} onChange={(e) => setNewRoom(e.target.value)} label='Enter a New Room Name' id='room' type='text'/>
                                <MDBBtn className='mt-2' onClick={() => {console.log(newRoom)}}>Create Room</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCardBody>
                </div>
            </MDBCard>
            <MDBCard className='text-center m-5'>
                <MDBCardHeader>
                    <strong>Chat Room Users</strong>
                </MDBCardHeader>
                <MDBCardBody>
                    <MDBTabs justify className='mb-3'>
                        {availableRooms.map((room, index) => {
                            return (
                                <MDBTabsItem>
                                    <MDBTabsLink onClick={() => handleUsersClick('tab' + index)} active={usersActive === 'tab' + index}>
                                        {room.label}
                                    </MDBTabsLink>
                                </MDBTabsItem>
                            )
                        })}
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => handleUsersClick('tab4')} active={usersActive === 'tab4'}>
                                Room2
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>

                    <MDBTabsContent>
                        <MDBTabsPane show={usersActive === 'tab1'}>Room1</MDBTabsPane>
                        <MDBTabsPane show={usersActive === 'tab2'}>Tab 2 content</MDBTabsPane>
                        <MDBTabsPane show={usersActive === 'tab3'}>Tab 3 content</MDBTabsPane>
                    </MDBTabsContent>
                </MDBCardBody>
            </MDBCard>
            <Footer />
        </div>   
    )
}

export default Home;