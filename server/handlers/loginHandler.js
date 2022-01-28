const bcrypt = require("bcrypt");
const db = require("../db/db.json");

module.exports = (io, socket) => {

	const login = async (data) => {
		const {username, password} = JSON.parse(data);
		const {users} = db;
		for(const _user of users) {
			if(_user.username === username) {
				if(await bcrypt.compare(password, _user.password)) {
					io.to(socket.id).emit("login:success", "Logged in successfully")
				} else {
					io.to(socket.id).emit("login:error", "password_wrong")
				}
			}
		}
		io.to(socket.id).emit("login:error", "user_not_found")

	}


	socket.on("login", login)

}