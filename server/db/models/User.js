const {Schema, model, Types} = require('mongoose');

const chatSchema = new Schema({
	isGroup: Boolean,
	group: {
		type: Types.ObjectId,
		ref: "group"
	},
	user: {
		type: Types.ObjectId,
		ref: "user"
	},
}, {
	timestamps: true
})


const userSchema = new Schema({
	username: String,
	password: String,
	currentSocketId: String,
	chats: [chatSchema]
}, {
	timestamps: true
});

module.exports = model("user", userSchema);