import React from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBIcon
} from 'mdb-react-ui-kit';
import { useUserContext } from '../../context/UserContext';

const WelcomeTab = () => {
    const { username } = useUserContext();


    return (
        <MDBContainer className="text-center py-3">
        <MDBRow>
            <MDBCol>
            <MDBCard>
                <MDBCard className='px-5 mx-5 mt-3 py-2'>
                    <MDBCardTitle className="mb-0">Welcome {username}! <i className="fas fa-champagne-glasses"></i></MDBCardTitle>
                </MDBCard> 
                <MDBCardBody>
                <MDBCardText>
                    Join a room <i className="fas fa-door-open"></i> and start chatting with other users in real-time. Connect with people from all over the world and have meaningful conversations.
                </MDBCardText>
                <MDBCardText>
                    Check out the 'how to chat' tab for instructions and the 'features' page for information on the application and command use. <i className="fas fa-terminal"></i>
                </MDBCardText>
                <MDBCardText>
                    We hope you have a great time chatting and making new friends. <MDBIcon far icon="grin-tongue-squint" /> Enjoy your stay!
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>
        </MDBRow>

        </MDBContainer>
    );
};

export default WelcomeTab;
