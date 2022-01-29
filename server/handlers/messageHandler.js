module.exports = (io, socket) => {

	const privateMessageHandler = async ({to, message}) => {
		try {
			console.log("message:private", {to, message});
		} catch (e) {
			io.to(socket.id).emit("message:private:error", {message: e.message})
		}
	}

	const groupMessageHandler = async ({group_id, message}) => {

	}

	socket.on("message:private", privateMessageHandler);
	socket.on("message:group", groupMessageHandler);
}