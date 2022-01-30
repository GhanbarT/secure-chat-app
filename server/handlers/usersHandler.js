const bcrypt = require('bcrypt');
const {Users, Groups} = require('../db/models');

module.exports = (io, socket) => {

	const findUserBySocketId = async () => {
		try {
			return await Users.findOne({
				currentSocketId: socket.id
			}).populate('chats.user').populate('chats.group');
		} catch (e) {
			throw new Error();
		}
	};

	const login = async ({username, password}) => {
		try {
			const user = await Users.findOne({username});
			if (!user) {
				throw new Error('Wrong Credentials!');
			}
			if (await bcrypt.compare(password, user.password)) {
				try {
					user.currentSocketId = socket.id;
					await user.save();
					// add user to rooms
					const groups = await Groups.find({
						blpUsers: user._id
					});
					if(groups && groups.length) {
						socket.join(...groups.map(_group => `group:${_group._id.toString()}`));
					}
				} catch (e) {
					throw new Error('could not save session, server error!!');
				}
				io.to(socket.id).emit('login:success');
			} else {
				throw new Error('Wrong Credentials!');
			}
		} catch (e) {
			io.to(socket.id).emit('error', {message: e.message, where: 'login'});
		}
	};

	const getAllChats = async () => {
		findUserBySocketId()
			.then(user => {
				if (!user) {
					io.to(socket.id).emit('error', {message: 'forbidden', where: 'getAllChats'});
					return;
				}
				io.to(socket.id).emit('get-all-chats', user.chats);
			});
	};

	const addChat = async ({isGroup, id}) => {
		try {
			const user = await findUserBySocketId();
			if (!user) {

				io.to(socket.id).emit('error', {message: 'forbidden', where: 'getAllChats'});
				return;
			}
			user.chats = [
				...user.chats,
				{
					isGroup,
					group: isGroup ? id : null,
					user: !isGroup ? id : null
				}
			];
			await user.save();
			io.to(socket.id).emit('get-all-chats', user.chats);
		} catch (e) {
			io.to(socket.id).emit('error', {message: e.message, where: 'addChat'});
		}
	};

	socket.on('login', login);
	socket.on('get-all-chats', getAllChats);
	socket.on('add-chat', addChat);
};

