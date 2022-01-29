const {Schema, model, Types} = require('mongoose');

const userSchema = new Schema({
	username: String,
	password: String,
	currentSocketId: String,
	chats: []
}, {
	timestamps: true
});

module.exports = model("user", userSchema);