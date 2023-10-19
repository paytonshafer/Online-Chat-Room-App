import React, { useState, useEffect } from 'react';
import Footer from '../components/footer'
import MoreTab from '../components/home/more_tab';
import HowToTab from '../components/home/how_to_tab';
import WelcomeTab from '../components/home/welcome_tab';
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
import { toast, ToastContainer } from 'react-toastify'; // toast messages
import "react-toastify/dist/ReactToastify.css";
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
    const { username, userRoomList, setUserRoomList, curRoom, setCurRoom, setGMessages, gmessages, gRooms, setGRooms } = useUserContext();
    const [justifyActive, setJustifyActive] = useState('tab1') // state for which tab is showing
    const [usersActive, setUsersActive] = useState('tab1') // state for which tab is showing
    const [roomSelector, setRoomSelector] = useState() // room seletor var
    const [newRoom, setNewRoom] = useState('') // for new room creation
    const [messages, setMessages] = useState(gmessages) // message buffer for messages when not in chat window
    const [rooms, setRooms] = useState(gRooms) // list of rooms to join
    const [joinError, setJoinError] = useState(false) // join error if try to join room they are in

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
            addMessage("System: " + data + " has left the room."); // add user left message
        })

        // annouce that another user changed their username
        socket.on('other_name_change', (data) => {
            addMessage("System: The user '" + data.old + "' changed their username to '" + data.new + "'.") // add user change name
        })

        // when we receive a direct message
        socket.on('receive_direct_message', (data) => {
            addMessage(data.sender + " (direct message): " + data.message) //add message to buffer and not that it is a direct message
            toast(`${data.sender} (direct message): ${data.message}`, {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        })

        // when a new room is made by another
        socket.on('new_room', (data) => {
            addRoom(data)
            toast(`New Room called '${data.name}' Created`, {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        })
        
    }, [socket])

    // use effect to set global messages when messages update
    useEffect( () => {
        setGMessages(messages) // set global messages to messages when leave chat page
    }, [messages, setGMessages])

    // use effect to set global rooms when new room added
    useEffect( () => {
        setGRooms(rooms)
    }, [rooms, setGRooms])

    // function to add new room to list
    const addRoom = (data) => {
        setRooms((prev) => [...prev, data])
    }

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
    const joinRoom = (e) => {
        e.preventDefault()
        if(roomSelector && roomSelector !== curRoom){
            setCurRoom(roomSelector) // set current room to one in selector
            setMessages(["System: You have joined room: " + roomSelector + " as '" + username  + "'. Send /help for a list of commands."]) // add initial chat message and clear out any messages from an old room
            socket.emit('join_room', {user: username, room: roomSelector}) // emit to server that you joined that room
            toast.success(`Joined '${roomSelector}', Go Chat!`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            setJoinError(false)
        }
        if(roomSelector === curRoom ){
            setJoinError(true) // show join error
        }
    }

    // function to create room
    const createRoom = (e) => {
        e.preventDefault()
        if(newRoom.trim() !== ''){ // if the room is not empty
            if(!rooms.map((room) => room.name).includes(newRoom.trim())){ // if the room is not already a room
                socket.emit('create_room', {room: newRoom}) // let other know about new room
                /*NO NEED FOR THIS BC ONE FROM EMITtoast.success(`New Room: '${newRoom}' created`, { // pop up for new room success
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })*/
                setNewRoom('')
            } else { // tried to create room that exists
                toast.warning(`'${newRoom}' is already a room`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
                setNewRoom('')
            }
        } else { // pressed with out entering room name
            toast.error('Please enter a valid room name', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
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
                <MDBCardBody className='p-0'>
                    <MDBTabsContent>
                        <MDBTabsPane show={justifyActive === 'tab1'}>
                            <WelcomeTab />
                        </MDBTabsPane>
                        <MDBTabsPane show={justifyActive === 'tab2'}>
                           <HowToTab />
                        </MDBTabsPane>
                        <MDBTabsPane show={justifyActive === 'tab3'} style={{marginBottom: '2px', marginTop: '2px'}}>
                            <MoreTab />
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
                        <MDBCardTitle>Room Selection <div className='fs-6 fw-light' style={joinError ? {color: 'red'} : null}>{curRoom ? `Current Room: ${curRoom}` : 'Join a Room Below!' }</div></MDBCardTitle>
                        <MDBCardText >
                            Choose an existing chat room from the list below to join a conversation with other users.
                        </MDBCardText>
                        <MDBCard className='w-40'>
                            <MDBCardBody className='d-flex flex-row justify-content-center'>
                                <div style={{width: '20rem'}}>
                                    <Select className='m-4' menuPlacement="auto" menuPosition="fixed" options={rooms.map((room) => room.name).filter((value, index, array) => array.indexOf(value) === index).map((data) => {return {value: data, label: data}})} onChange={(e) => {setRoomSelector(e.value)}}/>
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
                                <MDBBtn className='mt-2' onClick={createRoom}>Create Room</MDBBtn>
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
                        {userRoomList.map((data, index) =>{
                           return (
                                <MDBTabsPane key={index} show={usersActive === 'tab' + index}>
                                    <ul className="list-group room-list">
                                        <li className="list-group-item list-group-item-dark">Users in {data.room}</li>
                                        {data.users.map((user, userIndex) => {
                                         return <li className="list-group-item" key={userIndex}>
                                            {user}
                                        </li>})}
                                    </ul>
                                </MDBTabsPane>)
                        })}
                    </MDBTabsContent>
                </MDBCardBody>
            </MDBCard>
            <Footer />
            <ToastContainer/>
        </div>   
    )
}

export default Home;