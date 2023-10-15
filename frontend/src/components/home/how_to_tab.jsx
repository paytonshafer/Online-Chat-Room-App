import React from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
} from 'mdb-react-ui-kit';

const HowToTab = () => {
    return (
        <MDBContainer>
        <MDBRow className="my-4">
            <MDBCol>
            <MDBCard>
                <MDBCardBody>
                <MDBCardTitle className="mb-4">How to Chat</MDBCardTitle>
                <MDBCardText>
                    Welcome to our chat room! We've made it easy for you to get started and enjoy your chat experience.
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>
        </MDBRow>

        <MDBRow>
            <MDBCol>
            <MDBCard>
                <MDBCardBody>
                <MDBCardTitle>Choose a Room</MDBCardTitle>
                <MDBCardText>
                    Below, you can select an existing chat room or create a new one. Simply click on a room and join or use the "Create Room" button.
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>

            <MDBCol>
            <MDBCard>
                <MDBCardBody>
                <MDBCardTitle>Start Chatting</MDBCardTitle>
                <MDBCardText>
                    Once joined, head to the chat page, type your messages in the input field at the bottom, and press "Send" to send a message.
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>
        </MDBRow>

        <MDBRow>
            <MDBCol>
            <MDBCard>
                <MDBCardBody>
                <MDBCardTitle>Explore Commands</MDBCardTitle>
                <MDBCardText>
                    Enhance your chat experience by using commands like "/help" to see the list of available actions and many more.
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>

            <MDBCol>
            <MDBCard>
                <MDBCardBody>
                <MDBCardTitle>Change Rooms</MDBCardTitle>
                <MDBCardText>
                    Head back to the home page, select a new room the same way you joined the first one, and head back to the chat page to chat again!
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>
        </MDBRow>

        <MDBRow className="my-4">
            <MDBCol>
            <MDBCard>
                <MDBCardBody>
                <MDBCardText>
                    You're ready to chat and connect with others in real-time. If you have any questions or need assistance, check the 'more' tab!
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>
        </MDBRow>
        </MDBContainer>
    );
};

export default HowToTab;
