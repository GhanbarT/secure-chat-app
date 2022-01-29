// create socket
const socket = io('ws://localhost:3000', {
    path: '/socket'
});


/*************************
 *   Global Variables
 **************************/
let chats = [];

// Todo: change @currentChat to null
let currentChat = 0;

/********************
 * Element finding
 *********************/
// login layout
const loginForm = document.getElementById('login-form');
const masterHead = document.querySelector('.masthead');
const loginErrorMessage = document.getElementById('login-error');


// main layout
const layout = document.querySelector('.layout');
const messages = document.getElementById('messages');
const messageInputForm = document.getElementById('message-input');
const messageInput = document.getElementById('message-text-input');
const sendMessageBtn = messageInputForm.querySelector('input[type=submit]');


const chatBar = document.getElementById('chat-bar');

/************************
 *   Login Handlers
 *************************/
socket.on('login:success', (data) => {
    /* if login successfully */

    // hide master head
    masterHead.classList.add('display-none');

    // show main layout
    layout.classList.remove('display-none');
    messageInput.focus();

    // get chats
    socket.emit('get-all-chats');
});

socket.on('login:error', (data) => {
    /* if login failure */

    // find elements
    const usernameEl = loginForm.querySelector('input[type="text"]');

    // create message
    let message = '';
    message += '<li>username or password are wrong</li>';
    message += '<li>please enter your information correctly</li>';

    // show error message
    loginErrorMessage.classList.remove('display-none');
    loginErrorMessage.innerHTML = `<ul>${message}</ul>`;

    // change focus to elements
    usernameEl.select();
    usernameEl.focus();
});

/**********************
 *   User Handlers
 ***********************/
socket.on('get-all-chats', (data) => {
    console.log(data);
});

socket.on('add-chat', (data) => {

});

socket.on('message', ({from, message}) => {
    const el = document.createElement('li');
    el.innerHTML = data;
    messages.appendChild(el);
});


/*************************
 *   Functions
 **************************/
function sendMessage() {
    if (messageInput.value.trim()) {
        console.log({message: messageInput.value, to: 'mamad'});
        socket.emit('message:private', {message: messageInput.value, to: 'mamad'});
        messageInput.value = '';
        messageInput.focus();
    }
}

function selectChat(e) {
    console.log(e.currentTarget);
}

/****************************
 *   Event Listeners
 *****************************/


// login: submit
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameEl = loginForm.querySelector('input[type="text"]');
    const passwordEl = loginForm.querySelector('input[type="password"]');

    // check inputs
    loginErrorMessage.classList.add('display-none');
    let message = '';
    if (!usernameEl.value) {
        loginErrorMessage.classList.remove('display-none');
        message += '<li>please enter your username</li>';
        usernameEl.focus();
    }
    if (!passwordEl.value) {
        loginErrorMessage.classList.remove('display-none');
        message += '<li>please enter your password</li>';
        passwordEl.focus();
    }
    loginErrorMessage.innerHTML = `<ul>${message}</ul>`;

    // send information to server
    let username = usernameEl.value;
    let password = passwordEl.value;
    socket.emit('login', {username, password});

    // console.log({username, password});
});


chatBar.addEventListener('click', selectChat);

// message: submit
messageInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentChat === null) return;
    sendMessage();
});
