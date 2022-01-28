const bcrypt = require("bcrypt");

module.exports = (io, socket, store) => {

	const findUserBySocketId = () => {
		for(const _user of store.users) {
			if(_user.currentSocketId === socket.id) {
				return _user;
			}
		}
		return null;
	}

	const login = async (data) => {
		const {username, password} = JSON.parse(data);
		for (const _user of store.users) {
			if (_user.username === username) {
				if (await bcrypt.compare(password, _user.password)) {
					io.to(socket.id).emit("login:success");
					_user.currentSocketId = socket.id;
				} else {
					io.to(socket.id).emit("login:error")
				}
			}
		}
		io.to(socket.id).emit("login:error")
	}

	const getAllChats = () => {
		const user = findUserBySocketId();
		if(!user) {
			io.to(socket.id).emit("forbidden")
		}
		io.to(socket.id).emit("get-all-chats", user.chats);
	}

	const addChat = (data) => {

	}

	socket.on("login", login)
	socket.on("get-all-chats", getAllChats)
	socket.on("add-chat", addChat)
}