// create socket
const socket = io('ws://localhost:3000', {
    path: '/socket'
});
let sessionKey = '';

socket.on('connect', () => {
    sessionKey = socket.id;
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

// main
const chatBar = document.getElementById('chat-bar');
const messageWrapper = document.getElementById('message-wrapper');

searchBar = document.getElementById('search-bar');
addChatBtn = document.getElementById('add-chat-btn');

// input
const messageInputForm = document.getElementById('message-input');
const messageInput = document.getElementById('message-text-input');
const sendMessageBtn = messageInputForm.querySelector('input[type=submit]');

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

    // clear chat message wrapper
    messageWrapper.innerHTML = '';


    console.log(data);


    allChatsHtml = '<ul>';
    let singleChat = `<li data-index="0">1</li>`;
    allChatsHtml += singleChat;
    allChatsHtml += '</ul>';

});

socket.on('add-chat', (data) => {

});

socket.on('message', ({from, message}) => {
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
    let children = chatBar.querySelectorAll('li');

    for (const el of children) {
        el.classList.remove('selected');
    }
    console.log(e.target, e.target.dataset.index);
    e.target.classList.add('selected');

    // currentChat = e.target.dataset.index;

    // get message of current chat
    // change @messageWrapper innerHtml

    allMessage = '';
    name = 'name';
    text = 'message text';
    message = `<article class="message"><div class="avatar">${name}</div><div class="message-text">${text}</div></article>`;
    allMessage += message;

    // messageWrapper.innerHTML = allMessage
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

addChatBtn.addEventListener('click', (e) => {

});

// message: submit
messageInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentChat === null) return;
    sendMessage();
});
