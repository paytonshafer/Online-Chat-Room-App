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

const MoreTab = () => {
    return (
        <MDBContainer className='py-3'>
        <MDBRow>
            <MDBCol>
            <MDBCard>
                <MDBCardBody>
                <MDBCardTitle>Source Code <i class="far fa-file-code"></i></MDBCardTitle>
                <MDBCardText className='py-0'>
                    You can explore the source code of our chat room application on GitHub. Access the repository to view <i class="fas fa-folder-tree"></i>, contribute <i class="fas fa-code-pull-request"></i>, or even fork <i class="fas fa-code-fork"></i> the code. Your contributions and insights are welcome!
                </MDBCardText>
                <a
                    href="https://github.com/paytonshafer/Online-Chat-Room-App"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                >
                    Visit our GitHub Repository <i class="fab fa-github"></i>
                </a>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>

            <MDBCol>
            <MDBCard>
                <MDBCardBody>
                <MDBCardTitle>Project Documentation <i class="fas fa-book"></i></MDBCardTitle>
                <MDBCardText>
                    If you're looking for detailed documentation or guides on how to use and contribute to our chat room application, you'll find it here. Get started with comprehensive instructions. <i class="fas fa-book-open-reader"></i>
                </MDBCardText>
                <a href="/documentation" className="btn btn-primary disabled">
                    Explore Project Documentation
                </a>
                </MDBCardBody>
            </MDBCard>
            </MDBCol>
        </MDBRow>
        </MDBContainer>
    );
};

export default MoreTab;