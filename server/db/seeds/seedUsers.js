const {Users} = require("../models");
const {Types} = require("mongoose");

const seedUsers = async () => {
	try {
		console.log("seeding users");
		// await Users.create([
		// 	{
		// 		username: "ghanbar",
		// 		password: "$2b$10$9Dy85zGu02E7RB7BSMlLxuWcmF9TisjijKj1HftFEplIeDoQjvPMG"
		// 	},
		// 	{
		// 		username: "mammad",
		// 		password: "$2b$10$9Dy85zGu02E7RB7BSMlLxuWcmF9TisjijKj1HftFEplIeDoQjvPMG"
		// 	}
		// ]);

		const user = await Users.findOne({
			_id: new Types.ObjectId("61f4f49cb4ce9cc4df7f3e66")
		})

		user.chats = [
			{
				isGroup: false,
				group: null,
				user: new Types.ObjectId("61f4f49cb4ce9cc4df7f3e65")
			},
			{
				isGroup: true,
				group: new Types.ObjectId("61f4f49db4ce9cc4df7f3e69"),
				user: null
			}
		]

		await user.save();

		console.log("Done");
	} catch (e) {
		console.log(e)
	}
}

module.exports = seedUsers