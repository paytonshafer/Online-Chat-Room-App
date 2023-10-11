import React, { useRef } from 'react';
import chat from './imgs/chat.jpg'
import commands from './imgs/commands.jpg'
import users from './imgs/users.jpg'
import Footer from '../components/footer'
import { useUserContext } from '../context/UserContext'; // get username context
import {
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
    MDBCardGroup,
    MDBIcon,
    MDBAccordion, 
    MDBAccordionItem
  } from 'mdb-react-ui-kit';

/*
Overall info and featues
commands accordian
*/


// feature page
const Features = ({ socket }) => {
    const { username } = useUserContext();
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

            <MDBCard className='m-5' ref={commandListRef}>
                <MDBCardBody>
                    <MDBCardTitle>Command List</MDBCardTitle>
                    <MDBAccordion flush alwaysOpen style={{fontWeight: 'bold'}}>
                        <MDBAccordionItem collapseId={1} headerTitle='/help' bodyStyle={{fontWeight: 'normal'}}>
                            Command Info
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={2} headerTitle='/users' bodyStyle={{fontWeight: 'normal'}}>
                            Command Info
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={3} headerTitle='/clear' bodyStyle={{fontWeight: 'normal'}}>
                            Command info
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={4} headerTitle='/username' bodyStyle={{fontWeight: 'normal'}}>
                            Command info
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={5} headerTitle='/direct' bodyStyle={{fontWeight: 'normal'}}>
                            Command info
                        </MDBAccordionItem>
                    </MDBAccordion>
                </MDBCardBody>
            </MDBCard>
            <Footer />
        </div>
    );
}

export default Features;