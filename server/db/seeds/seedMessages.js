const {Messages} = require("../models");
const {Types} = require("mongoose");

const seedMessages = async () => {
	try {
		console.log("seeding messages ...");

		await Messages.create([
			{
				isInGroup: false,
				group: null,
				to: new Types.ObjectId("61f4f49cb4ce9cc4df7f3e66"),
				from: new Types.ObjectId("61f4f49cb4ce9cc4df7f3e65"),
				content: "Hello World!!"
			},
			{
				isInGroup: true,
				group: new Types.ObjectId("61f4f49db4ce9cc4df7f3e69"),
				to: null,
				from: new Types.ObjectId("61f4f49cb4ce9cc4df7f3e66"),
				content: "Hello World In Group!!"
			}
		])

		console.log("Done");
	} catch (e) {
		console.log(e);
	}
}

module.exports = seedMessages