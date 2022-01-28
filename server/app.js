const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const {Server} = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		credentials: true
	},
	path: "/socket"
});

instrument(io, {
	auth: false
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

const db = require("./db/db.json");

// sockets
io.on('connection', (socket) => {
	console.log('a user connected', {id: socket.id, connected: socket.connected});
	socket.on("message", data => {
		console.log("new message", data);
	})

	socket.on("login", data => {
		console.log("login", data);
		console.log(db.users);
	})
});



// start server
const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
	console.log(`Server running on port ${port}`);
})
