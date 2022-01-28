const {Schema, model, Types} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
	username: String,
	password: String
}, {
	timestamps: true
});

module.exports = model("user", userSchema);