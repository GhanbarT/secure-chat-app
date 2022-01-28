const socket = io("ws://localhost:5050");

const loginForm = document.getElementById("login-form");
const masterHead = document.querySelector(".masthead");

const messages = document.getElementById("messages");
const messageInputForm = document.getElementById("message-input");
const messageInput = messageInputForm.querySelectorAll("input[type=text]")[0];

socket.on("message", (text) => {
	const el = document.createElement("li");
	el.innerHTML = text;
	messages.appendChild(el);
});

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const usernameEl = loginForm.querySelector('input[type="text"]');
	const passwordEl = loginForm.querySelector('input[type="password"]');
	const errorMessage = loginForm.querySelector(".error");

	// check inputs
	errorMessage.classList.add("display-none");
	let message = "";
	if (!usernameEl.value) {
		errorMessage.classList.remove("display-none");
		message = "<li>please input username</li>";
		usernameEl.focus();
	}
	if (!passwordEl.value) {
		errorMessage.classList.remove("display-none");
		message += "<li>please input username</li>";
		passwordEl.focus();
	}
	errorMessage.innerHTML = `<ul>${message}</ul>`;

	// send information to server
	let username = usernameEl.value;
	let password = passwordEl.value;
	console.log(JSON.stringify({ username, password }));
	data = JSON.stringify({ username, password });
	socket.emit("login", data);

	// if login succesfull
	masterHead.classList.add("display-none");
	messageInputForm.classList.remove("display-none");
    messageInput.focus();
});

messageInputForm.addEventListener("submit", (e) => {
	e.preventDefault();
	if (messageInput.value) {
		socket.emit("message", messageInput.value);
		messageInput.value = "";
        messageInput.focus();
	}
});
