import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';

const Footer = () => {
return (
    <MDBFooter bgColor='light' className='text-center text-lg-left'>
        <MDBContainer className='p-4'>
            <MDBRow>
                <MDBCol lg='6' md='12' className='mb-4 mb-md-0'>
                    <h5 className='text-uppercase'>User Interaction</h5>
                    <p>
                        Interact with fellow users effortlessly. Join chat rooms with a unique username, change your username on the fly, and ensure it's always one-of-a-kind. Communicate in real time with the integrated chat feature, making the online chat room a dynamic hub of conversation.
                    </p>
                </MDBCol>

                <MDBCol lg='6' md='12' className='mb-4 mb-md-0'>
                    <h5 className='text-uppercase'>Command Functionality</h5>
                    <p>
                        Seamlessly control your chat experience with built-in commands. Access helpful functions, such as listing connected users or clearing your chat window, by using intuitive command prompts. Make the chat room your own with feature-rich commands designed to elevate your conversations.
                    </p>
                </MDBCol>
            </MDBRow>
        </MDBContainer>

        <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            &copy; {2023} Copyright (MIT License):{' '}
            <a className='text-dark' href='https://github.com/paytonshafer/Online-Chat-Room-App/blob/main/LICENSE'>
                github.com/paytonshafer/Online-Chat-Room-App/LICENSE
            </a>
        </div>
    </MDBFooter>
);
}

export default Footer