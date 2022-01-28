module.exports = (io, socket, store) => {

	const messageHandler = (data) => {
		console.log("message", store);
	}

	socket.on("message", messageHandler)
}