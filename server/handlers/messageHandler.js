module.exports = (io, socket) => {

	const messageHandler = (data) => {
		console.log("message");
	}

	socket.on("message", messageHandler)
}