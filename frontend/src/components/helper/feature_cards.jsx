import React, {useRef} from 'react';
import chat from './imgs/chat.jpg' //get img
import commands from './imgs/commands.jpg' //get img
import users from './imgs/users.jpg' //get img
import {
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
    MDBCardGroup,
    MDBIcon
  } from 'mdb-react-ui-kit';

const FeatureCards = () => {
    const commandListRef = useRef(null); // useRef to go to command list

    return (
        <div>
            <MDBCardGroup className='mx-3 my-5'>
                <MDBCard className='mx-1'>
                    <MDBCardImage src={chat} alt='...' position='top' />
                    <MDBCardBody>
                    <MDBCardTitle>Real-Time Messaging</MDBCardTitle>
                    <MDBCardText>
                        Experience uninterrupted real-time messaging that ensures your messages are delivered instantly for seamless and lively conversations.
                    </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter>
                    <small className='text-muted'>Seize the power of communication</small>
                    </MDBCardFooter>
                </MDBCard>

                <MDBCard className='mx-1'>
                    <MDBCardImage src={commands} alt='...' position='top' />
                    <MDBCardBody>
                    <MDBCardTitle>Command Support</MDBCardTitle>
                    <MDBCardText>
                        Elevate your chat experience with built-in commands for effortless control and enhanced functionality. Explore the full list and how to use them below. <MDBIcon fas icon="arrow-circle-down" onClick={() => {commandListRef.current.scrollIntoView({ behavior: 'smooth' });}}/>
                    </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter>
                    <small className='text-muted'>Enhanced chat control and a simplified experience</small>
                    </MDBCardFooter>
                </MDBCard>

                <MDBCard className='mx-1'>
                    <MDBCardImage src={users} alt='...' position='top' />
                    <MDBCardBody>
                    <MDBCardTitle>User Management and Unique Identities</MDBCardTitle>
                    <MDBCardText>
                        Personalize your identity with unique usernames, and change your alias at will, all while ensuring each user maintains a distinct online identity.
                    </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter>
                    <small className='text-muted'>Connecting users, one message at a time</small>
                    </MDBCardFooter>
                </MDBCard>
            </MDBCardGroup>
            <div ref={commandListRef}></div>
        </div>
    )
}

export default FeatureCards