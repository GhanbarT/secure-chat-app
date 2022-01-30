const {Messages, Users, Groups} = require("../db/models")

module.exports = (io, socket) => {

	const privateMessageHandler = async ({to, message}) => {
		try {
			const currentUser = await Users.findOne({
				currentSocketId: socket.id
			});
			if(!currentUser) {
				throw new Error("forbidden");
			}
			const targetUser = await Users.findOne({
				_id: to
			});
			if(!targetUser) {
				throw new Error("could not find target user");
			}
			const _message = await Messages.create({
				isGroup: false,
				group: null,
				to: targetUser._id,
				from: currentUser._id,
				content: message
			});
			if(!_message) {
				throw new Error("Could not create message");
			}
			// send message in target user socket
			io.to(targetUser.currentSocketId).emit("get_message:private", {
				..._message.toJSON(),
				to: targetUser,
				from: currentUser
			})
		} catch (e) {
			io.to(socket.id).emit("error", {message: e.message, where: "privateMessage"})
		}
	}

	const groupMessageHandler = async ({group_id, message}) => {
		try {
			const currentUser = await Users.findOne({
				currentSocketId: socket.id
			});
			if(!currentUser) {
				throw new Error("forbidden");
			}
			const group = await Groups.findOne({
				_id: group_id
			});
			if(!group) {
				throw new Error("There is no group with specified id");
			}
			// check write access
			if(
				group.bibaUsers.findIndex(
					_user => _user.toString() === currentUser._id.toString()
				) === -1
			) {
				throw new Error("You don't have write access on this group");
			} else {
				// user can write
				const _message = await Messages.create({
					isGroup: true,
					group: group._id,
					to: null,
					from: currentUser._id,
					content: message
				});
				if(!_message) {
					throw new Error("Could not create message, server error!")
				}
				io.in(`group:${group._id.toString()}`).emit("get_message:group", {
					..._message.toJSON(),
					group: group,
					from: currentUser
				});
			}
		} catch (e) {
			io.to(socket.id).emit("error", {message: e.message, where: "groupMessage"})
		}
	}

	const getAllPrivateMessagesHandler = async ({to}) => {
		try {
			const currentUser = await Users.findOne({
				currentSocketId: socket.id
			});
			if(!currentUser) {
				throw new Error("forbidden");
			}
			const targetUser = await Users.findOne({
				_id: to
			});
			if(!targetUser) {
				throw new Error("could not find target user");
			}
			const messages = await Messages.find({
				isGroup: false,
				to: targetUser._id,
				from: currentUser._id
			})
				.sort({
					createdAt: -1,
					_id: 1
				});
			if(!messages) {
				throw new Error("Could not get messages! server error!!")
			}
			io.to(targetUser.currentSocketId).emit(
				"get_all_messages:private",
				messages.map(_message => ({
					..._message.toJSON(),
					to: targetUser,
					from: currentUser
				}))
			);
		} catch (e) {
			io.to(socket.id).emit("error", {message: e.message, where: "getAllPrivateMessages"})
		}
	}

	const getAllGroupMessagesHandler = async ({group_id}) => {
		try {
			const currentUser = await Users.findOne({
				currentSocketId: socket.id
			});
			if(!currentUser) {
				throw new Error("forbidden");
			}
			const group = await Groups.findOne({
				_id: group_id
			});
			if(!group) {
				throw new Error("There is no group with specified id");
			}
			// check read access
			if(
				group.blpUsers.findIndex(
					_user => _user.toString() === currentUser._id.toString()
				) === -1
			) {
				throw new Error("You don't have read access on this group");
			} else {

				const messages = await Messages.find({
					isGroup: true,
					group: group._id,
					from: currentUser._id
				})
					.sort({
						createdAt: -1,
						_id: 1
					});
				if(!messages) {
					throw new Error("Could not get messages! server error!!")
				}

				io.in(`group:${group._id.toString()}`).emit(
					"get_all_messages:group",
					messages.map(_message => ({
						..._message.toJSON(),
						group: group,
						from: currentUser
					}))
				);
			}
		} catch (e) {
			io.to(socket.id).emit("error", {message: e.message, where: "getAllGroupMessages"})
		}
	}

	socket.on("message:private", privateMessageHandler);
	socket.on("message:group", groupMessageHandler);
	socket.on("message:all-messages:private", getAllPrivateMessagesHandler);
	socket.on("message:all-messages:group", getAllGroupMessagesHandler);
}