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

// Todo: change @currentChatIndex to null
let currentChatIndex = 0;

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
	// console.log('login:success');

	// hide master head
	masterHead.classList.add('display-none');

	// show main layout
	layout.classList.remove('display-none');
	messageInput.focus();

	// get chats
	socket.emit('get-all-chats');
});

socket.on('error', ({message, where}) => {
	/* if login failure */
	if (where === 'login') {
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
	}
});

/**********************
 *   User Handlers
 ***********************/
socket.on('get-all-chats', (data) => {

	chats = data.map(item => {
		let {isGroup, group, user} = item;
		return {isGroup, group, user};
	});
	console.log(chats);

	singleChats = chats.map((item, index) => {
		let chatName = item.isGroup ? item.group.groupName : item.user.username;
		return `<li data-index="${index}">${chatName}</li>`;
	}).join('');

	// clear chat message wrapper
	messageWrapper.innerHTML = '<div class="notification">no chat selected</div>';

	// change chatBar html
	chatBar.innerHTML = `<ul> ${singleChats} </ul>`;
});

socket.on('add-chat', (data) => {

});

socket.on('get_message:private', (data) => {
	console.log(data);
	let {from, content} = data;

	for (let i = 0; i < chats.length; i++) {
		if (from._id === chats[i].user._id) {
			if (chats[i].messages) {
				chats[i].messages.append(content);
			} else {
				chats[i].message = [];
				chats[i].messages.append(content);
			}
		}
	}

	let currentChat = chats[currentChatIndex];
	let currentChatId = currentChat.isGroup ? currentChat.group._id : currentChat.user._id;
	if (currentChatId === from._id) {
		messageWrapper.innerHTML +=
			`<article class="message">
				<div class="avatar">${from.username}</div>
				<div class="message-text">${content}</div>
			</article>`;
	}
});


/*************************
 *   Functions
 **************************/
function sendMessage() {
	if (messageInput.value.trim()) {
		console.log({
			message: messageInput.value,
			to: chats[currentChatIndex].isGroup ? chats[currentChatIndex].group._id : chats[currentChatIndex].user._id
		});
		socket.emit(
			'message:private',
			{
				message: messageInput.value,
				to: chats[currentChatIndex].isGroup ? chats[currentChatIndex].group._id : chats[currentChatIndex].user._id
			}
		);
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

	// currentChatIndex = e.target.dataset.index;

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
	if (currentChatIndex === null) return;
	sendMessage();
});
