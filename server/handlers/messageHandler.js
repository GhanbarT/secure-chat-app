module.exports = (io, socket) => {

	const messageHandler = (data) => {
		console.log("message", data);
	}

	socket.on("message", messageHandler)
}