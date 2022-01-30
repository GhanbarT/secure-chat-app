const {Schema, model, Types} = require('mongoose');

const messageSchema = new Schema({
	isGroup: Boolean,
	group: {
		type: Types.ObjectId,
		ref: "group"
	},
	to: {
		type: Types.ObjectId,
		ref: "user"
	},
	from: {
		type: Types.ObjectId,
		ref: "user"
	},
	content: {
		type: String,
		trim: true
	}
}, {
	timestamps: true
});

module.exports = model("message", messageSchema);
