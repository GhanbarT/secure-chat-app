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
			io.to(socket.id).emit("error", {message: e.message, where: "login"});
		}
	}

	const getAllChats = () => {
		findUserBySocketId().then(user => {
        if(!user) {
            io.to(socket.id).emit("error", {message: "forbidden", where: "getAllChats"});
            return;
        }

        console.log(user, user.chats);
        io.to(socket.id).emit("get-all-chats", user.chats);
    });
	}

	const addChat = async ({isGroup, id}) => {
		try {
			const user = await findUserBySocketId();
			if(!user) {
				io.to(socket.id).emit("error", {message: "forbidden", where: "getAllChats"});
				return;
			}
			user.chats = [
				...user.chats,
				{
					isGroup,
					group: isGroup ? id : null,
					user: !isGroup  ? id : null
				}
			]
			await user.save();
			io.to(socket.id).emit("get-all-chats", user.chats);
		} catch (e) {
			io.to(socket.id).emit("error", {message: e.message, where: "addChat"})
		}
	}

	socket.on("login", login)
	socket.on("get-all-chats", getAllChats)
	socket.on("add-chat", addChat)
}

