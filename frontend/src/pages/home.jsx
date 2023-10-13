import React, { useState, useEffect } from 'react';
import Footer from '../components/footer'
import { useUserContext } from '../context/UserContext'; // get username context
import Select from 'react-select' // select object for room selecttion
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
    MDBInput,
    MDBTooltip
  } from 'mdb-react-ui-kit';
/*
Rethink where refresh button is

Welcome, how to use, other idrk
    add content: welcome message, how to use (enter room, creatre room, feature page), other (link to source code, about the author?)
room selection
Show who is in what room in a card with tabs for each room
    map users from rooms to tabs
    on login get all the users in all the rooms for home page put in userContext -> get rooms from here too
        add refresh button to get newer data
*/


// home page
const Home = ({ socket }) => {
    const { username, userRoomList, setUserRoomList, curRoom, setCurRoom, setGMessages, gmessages } = useUserContext();
    const [justifyActive, setJustifyActive] = useState('tab1') // state for which tab is showing
    const [usersActive, setUsersActive] = useState('tab1') // state for which tab is showing
    const [roomSelector, setRoomSelector] = useState('') // room seletor var
    const [newRoom, setNewRoom] = useState('') // for new room creation
    const [messages, setMessages] = useState(gmessages) // message buffer for messages when not in chat window

    // use effect on initial load that sets listeners
    useEffect(() => {
        // SOCKET.IO EVENT LISTENERS
        // setting what happens when chat_message is emitted
        socket.on("chat_message", (data) => {
            addMessage(data.sender + ": " + data.message); // add new message buffer
        })

        // setting what happens when user_join is emitted
        socket.on("user_join", (data) => {
            addMessage("System: " + data + " just joined the room!") // add new user message
        })

        // setting what happens when user_leave is emitted
        socket.on("user_leave", (data) => {
            addMessage("System: " + data + " has left the room."); // add user left messag
        })

        // annouce that another user changed their username
        socket.on('other_name_change', (data) => {
            addMessage("System: The user '" + data.old + "' changed their username to '" + data.new + "'.") // add user change name
        })

        // when we receive a direct message
        socket.on('receive_direct_message', (data) => {
            addMessage(data.sender + " (direct message): " + data.message) //add message to buffer and not that it is a direct message
        })
        
    }, [socket])

    // use effect to set global messages when messages update
    useEffect( () => {
        setGMessages(messages) // set global messages to messages when leave chat page
    }, [messages, setGMessages])

    // add message function to add new message to the buffer
    const addMessage = (data) => {
        setMessages((prev) => [...prev, data]) // add message to the end of the message buffer
    }

    // function to handle switching between welcome tabs
    const handleJustifyClick = (value) => {
        if (value === justifyActive) { // if value is the active one then ignore
        return;
        }

        setJustifyActive(value); // set the new tab
    };

    // function to handle switching between user list room tabs
    const handleUsersClick = (value) => {
        if (value === usersActive) { // if value is the active one then ignore
        return;
        }

        setUsersActive(value); // set the new tab
    };

    // handle the data refresh -> re setting userRoomList
    const handleRefresh = () => {
        socket.emit('req_user_room_list', {}, (data) => {
            setUserRoomList(data)
        })
    }

    // function to join a room
    const joinRoom = () => {
        setCurRoom(roomSelector) // set current room to one in selector
        setMessages(["System: You have joined room: " + roomSelector + " as '" + username  + "'. Send /help for a list of commands."]) // add initial chat message and clear out any messages from an old room
        socket.emit('join_room', {user: username, room: roomSelector}) // emit to server that you joined that room
        // add little pop up that says entered room_name head to chat page to chat
    }

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
                            <MDBCardTitle>Tell {username} how to chat</MDBCardTitle>
                        </MDBTabsPane>
                        <MDBTabsPane show={justifyActive === 'tab3'}>
                            <MDBCardTitle>More info for {username}</MDBCardTitle>
                        </MDBTabsPane>
                    </MDBTabsContent>
                </MDBCardBody>
            </MDBCard>

            <MDBCard className='text-center m-5'>
                <MDBCardHeader className='pb-1'>
                    <strong>Explore Existing Rooms or Create a New One</strong>
                    {/*<MDBBtn className='position-absolute top-0 end-0 me-2 mt-2 mb-2 py-1 px-2' onClick={handleRefresh}><i className="fas fa-rotate"></i></MDBBtn>*/}
                </MDBCardHeader>
                <div className='d-flex flex-row justify-content-around'>
                    <MDBCardBody className='d-flex flex-column align-items-center'>
                        <MDBCardTitle>Room Selection <div className='fs-6 fw-light'>{curRoom ? `Current Room: ${curRoom}` : 'Join a Room Below!' }</div></MDBCardTitle>
                        <MDBCardText >
                            Choose an existing chat room from the list below to join a conversation with other users.
                        </MDBCardText>
                        <MDBCard className='w-40'>
                            <MDBCardBody className='d-flex flex-row justify-content-center'>
                                <div style={{width: '20rem'}}>
                                    <Select className='m-4' menuPlacement="auto" menuPosition="fixed" options={[{value: 'room1', label: 'room1'}, {value: 'room2', label: 'room2'}]/*userRoomList.map((data) => {return {value: data.room, label: data.room}})*/} onChange={(e) => {setRoomSelector(e.value)}}/>
                                </div>
                                <MDBBtn className='m-4' onClick={joinRoom}>Join Room</MDBBtn>
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
                <MDBCardHeader className='pb-1'>
                    <strong>Chat Room Users</strong>
                    <div className='position-absolute top-0 end-0'>
                        <MDBTooltip className='pt-0 text-nowrap' tag='span' placement='left' title='Press to Refresh User Table'>
                            <MDBBtn className='me-2 mt-2 mb-2 py-1 px-2' onClick={handleRefresh}><i className="fas fa-rotate"></i></MDBBtn>
                        </MDBTooltip>
                    </div>
                    </MDBCardHeader>
                <MDBCardBody className='p-0 m-2'>
                    <MDBTabs justify className='mb-3'>
                        {userRoomList.map((data, index) => {
                            return (
                                <MDBTabsItem key={index}>
                                    <MDBTabsLink onClick={() => handleUsersClick('tab' + index)} active={usersActive === 'tab' + index}>
                                        {data.room}
                                    </MDBTabsLink>
                                </MDBTabsItem>
                            )
                        })}
                    </MDBTabs>

                    <MDBTabsContent>
                        {userRoomList.map((data, index) => {
                            return <MDBTabsPane key={index} show={usersActive === 'tab' + index}>
                                {/* style user list */}
                                {data.users.map((user, userIndex) => {return <p key={userIndex}>{user}</p>})}
                            </MDBTabsPane>
                        })}
                    </MDBTabsContent>
                </MDBCardBody>
            </MDBCard>
            <Footer />
        </div>   
    )
}

export default Home;