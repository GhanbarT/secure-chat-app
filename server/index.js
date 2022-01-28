const http = require("http").createServer();
const io = require("socket.io")(http, {
	cors: {origin: "*"},
});

io.on("connection", (socket) => {
	console.log(`user [${socket.id.substr(0, 5)}] connected`);


	/* 
	*	Disconnect
	*/
	socket.on("disconnect", () => {
		console.log(`user ${socket.id.substr(0, 5)} disconnected`);
	});

	/* 
	* New Message
	*/
	socket.on("message", (message) => {
		console.log(message);
		io.emit("message", `${socket.id.substr(0, 5)} said ${message}`);
	});

	/*
	 *	Login
	 */
	socket.on("login", (message) => {
		console.log(message);

		// check the user and password
		data = JSON.parse(message);
	});
});

http.listen(5050, () => {
	console.log("listening on http://localhost:5050");
});

// Regular Websockets

// const WebSocket = require('ws')
// const server = new WebSocket.Server({ port: '8080' })

// server.on('connection', socket => {

//   socket.on('message', message => {

//     socket.send(`Roger that! ${message}`);

//   });

// });
