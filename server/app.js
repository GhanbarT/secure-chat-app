const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");
const cors = require("cors");
const store = require("./db/db");

// const indexRouter = require('./routes/index.js');
// const usersRouter = require('./routes/users');

const {Server} = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

// socket handlers
const {usersHandler, messageHandler} = require("./handlers");

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
app.use(cors());

// routes
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// sockets
io.on('connection', (socket) => {
	console.log("getting new connection", socket.id)
	usersHandler(io, socket, store);
	messageHandler(io, socket, store);
});

// start server
const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
