const {Schema, model, Types} = require('mongoose');

const groupSchema = new Schema({
	groupName: {
		type: String,
		unique: true,
		required: true
	},
	blpUsers: [
		{
			type: Types.ObjectId,
			ref: "user"
		}
	],
	bibaUsers: [
		{
			type: Types.ObjectId,
			ref: "user"
		}
	]
}, {
	timestamps: true
});

module.exports = model("group", groupSchema);