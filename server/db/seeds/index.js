require("dotenv").config();
const {mongodbConnect} = require("../connection");

const seedUsers = require("./seedUsers");
const seedGroups = require("./seedGroups");
const seedMessages = require("./seedMessages");


(async () => {
	try {
		await mongodbConnect();

		// await seedUsers();
		// await seedGroups();
		// await seedMessages();

	} catch (e) {
		console.error(e);
	}
})();