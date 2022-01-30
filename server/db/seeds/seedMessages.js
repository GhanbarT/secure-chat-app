const {Messages} = require("../models");


const seedMessages = async () => {
	try {
		console.log("seeding messages ...");

		await Messages.create({

		})

		console.log("Done");
	} catch (e) {
		console.log(e);
	}
}

module.exports = seedMessages