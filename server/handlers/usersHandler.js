const bcrypt = require("bcrypt");
const {Users} = require("../db/models");

module.exports = (io, socket) => {

	const findUserBySocketId = async () => {
		try {
			return await Users.findOne({
				currentSocketId: socket.id
			});
		} catch (e) {
			throw new Error();
		}
	}

	const login = async ({username, password}) => {
		try {
			const user = await Users.findOne({username});
			if(!user) {
				throw new Error("Wrong Credentials!");
			}
			if (await bcrypt.compare(password, user.password)) {
				try {
					user.currentSocketId = socket.id;
					await user.save();
				} catch (e) {
					throw new Error();
				}
				io.to(socket.id).emit("login:success");
			} else {
				throw new Error("Wrong Credentials!")
			}
		} catch (e) {
			io.to(socket.id).emit("login:error", {message: e.message});
		}
	}

	const getAllChats = () => {
		const user = findUserBySocketId();
		if(!user) {
			io.to(socket.id).emit("forbidden");
			return;
		}
		io.to(socket.id).emit("get-all-chats", user.chats);
	}

	const addChat = (data) => {
		// todo;
	}

	socket.on("login", login)
	socket.on("get-all-chats", getAllChats)
	socket.on("add-chat", addChat)
}