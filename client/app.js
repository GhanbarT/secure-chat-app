// create socket
const socket = io('ws://localhost:3000', {
    path: '/socket'
});


/********************
 * Element finding
 *********************/
const loginForm = document.getElementById('login-form');
const masterHead = document.querySelector('.masthead');

const messages = document.getElementById('messages');
const messageInputForm = document.getElementById('message-input');
const messageInput = messageInputForm.querySelectorAll('input[type=text]')[0];


/**********************
 *   Login Handlers
 ***********************/
socket.on('login:success', (data) => {
    /* if login successfully */

    // hide master head
    masterHead.classList.add('display-none');

    // show input
    messageInputForm.classList.remove('display-none');
    messageInput.focus();

    // get chats
    socket.emit('get-all-chats');
});

socket.on('login:error', (data) => {
    /* if login failure */

    // find elements
    const usernameEl = loginForm.querySelector('input[type="text"]');
    const errorMessage = loginForm.querySelector('.error');

    // create message
    let message = '';
    message += '<li>username or password are wrong</li>';
    message += '<li>please enter info again</li>';
    errorMessage.innerHTML = `<ul>${message}</ul>`;

    // change focus to elements
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

socket.on('message', (data) => {
    const el = document.createElement('li');
    el.innerHTML = data;
    messages.appendChild(el);
});


/****************************
 *   Event Listeners
 *****************************/

// login: submit
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameEl = loginForm.querySelector('input[type="text"]');
    const passwordEl = loginForm.querySelector('input[type="password"]');
    const errorMessage = loginForm.querySelector('.error');

    // check inputs
    errorMessage.classList.add('display-none');
    let message = '';
    if (!usernameEl.value) {
        errorMessage.classList.remove('display-none');
        message += '<li>please input username</li>';
        usernameEl.focus();
    }
    if (!passwordEl.value) {
        errorMessage.classList.remove('display-none');
        message += '<li>please input username</li>';
        passwordEl.focus();
    }
    errorMessage.innerHTML = `<ul>${message}</ul>`;

    // send information to server
    let username = usernameEl.value;
    let password = passwordEl.value;
    console.log(JSON.stringify({username, password}));
    const data = JSON.stringify({username, password});
    socket.emit('login', data);
});

// message: submit
messageInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('message', messageInput.value);
        messageInput.value = '';
        messageInput.focus();
    }
});
