import React from 'react';
import { useUserContext } from '../../context/UserContext'; // get username context
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBAccordion, 
    MDBAccordionItem
  } from 'mdb-react-ui-kit';

const CommandList = () => {
    const { username } = useUserContext(); // get username to add some personalization

    return (
        <div>
            <MDBCard className='m-5'>
                <MDBCardBody>
                    <MDBCardTitle>Explore Our Command Library <small className='text-muted'>Click on a Command for Detailed Information</small></MDBCardTitle>
                    <MDBAccordion flush alwaysOpen>
                        <MDBAccordionItem collapseId={1} headerTitle='/help'>
                            <div>
                                <h2>Get Help</h2>
                                <p>
                                    The <code>/help</code> command provides you with a list of available commands to enhance your chat experience. Use this command to explore and utilize various functionalities within the chat room and enhance your experience.
                                </p>
                                <h3>Syntax:</h3>
                                <pre>/help</pre>
                                <p>
                                    When you type <code>/help</code> and send the command, the chat room will respond with a list of available commands and their descriptions.
                                </p>
                            </div>
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={2} headerTitle='/users'>
                            <div>
                                <h2>List Connected Users</h2>
                                <p>
                                    The <code>/users</code> command allows you to retrieve a list of all connected users in the chat room. This feature helps you stay informed about who is currently in the chat.
                                </p>

                                <h3>Syntax:</h3>
                                <pre>/users</pre>

                                <p>
                                    When you type <code>/users</code> and send the command, the chat room will respond by displaying a list of usernames for all connected users.
                                </p>
                            </div>
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={3} headerTitle='/clear'>
                            <div>
                                <h2>Clear Chat Feed</h2>
                                <p>
                                    The <code>/clear</code> command is a useful feature to clear all messages on your chat screen. It provides a quick way to declutter your chat window.
                                </p>

                                <h3>Syntax:</h3>
                                <pre>/clear</pre>

                                <p>
                                    When you type <code>/clear</code> and send the command, the chat room will instantly remove all previous messages from your screen, giving you a clean slate.
                                </p>
                            </div>
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={4} headerTitle='/username'>
                            <div>
                                <h2>Change Your Username</h2>
                                <p>
                                    The <code>/username</code> command allows you to change your current username to a new one. It ensures that the new username is unique and not already in use by another chat room member.
                                </p>

                                <h3>Syntax:</h3>
                                <pre>/username new_username</pre>

                                <ul>
                                    <li>
                                    <code>/username</code>: The command to initiate a direct message.
                                    </li>
                                    <li>
                                    <code>new_username</code>: Replace this with the new username you desire.
                                    </li>
                                </ul>

                                <h3>Example:</h3>
                                <pre>/username beet</pre>

                                <p>
                                    The command will attempt to change your current username to "beet." If the username is unique, it will be updated, and you'll be known as "beet" in the chat room. Otherwise, you will get a message letting you know that 'beet' is already taken by another user. <br></br>
                                    <strong>Note</strong> if you are unsure what usernames are taken you can use the <code>/users</code> command to check.
                                </p>
                            </div>
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={5} headerTitle='/direct'>
                            <div>
                                <h2>Direct Messaging</h2>
                                <p>
                                    The <code>/direct</code> command allows you to send a private message to another user in the chat room. To use this feature, follow these simple steps:
                                </p>

                                <h3>Syntax:</h3>
                                <pre>/direct other_user message</pre>

                                <ul>
                                    <li>
                                    <code>/direct</code>: The command to initiate a direct message.
                                    </li>
                                    <li>
                                    <code>other_user</code>: Replace this with the username of the user you want to message.
                                    </li>
                                    <li>
                                    <code>message</code>: Type your message after the username. This is the content you want to send.
                                    </li>
                                </ul>

                                <h3>Example:</h3>
                                <pre>/direct {username} Hey, how are you?</pre>

                                <p>
                                    This command sends a private message to the user named "{username}" with the text "Hey, how are you?" Direct messages are a great way to have private conversations within the chat room, ensuring your communication is only seen by the intended recipient. <br></br>
                                    <strong>Note</strong> that you <strong>can't</strong> send direct messages to yourself.
                                </p>
                            </div>
                        </MDBAccordionItem>
                        <MDBAccordionItem collapseId={6} headerTitle='/dice'>
                            <div>
                                <h2>Roll Some Dice</h2>
                                <p>
                                    The <code>/dice</code> command allows you roll as many dice as you specify (up to 50). To use this feature, follow these simple steps:
                                </p>

                                <h3>Syntax:</h3>
                                <pre>/dice num_rolls</pre>

                                <ul>
                                    <li>
                                    <code>/dice</code>: The command to initiate a dice roll.
                                    </li>
                                    <li>
                                    <code>num_rolls</code>: Replace this with the number of dice you want to roll, if blank you will roll 1 die.
                                    </li>
                                </ul>

                                <h3>Example:</h3>
                                <pre>/dice 5</pre>

                                <p>
                                    This command will return 'You rolled 3,5,2,1,2'. Use this command to play all kinds of fun games with friends in the chat room!
                                </p>
                            </div>
                        </MDBAccordionItem>
                    </MDBAccordion>
                </MDBCardBody>
            </MDBCard>
        </div>
    )
}

export default CommandList