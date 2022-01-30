require("dotenv").config();
const {mongodbConnect} = require("../connection");

const seedUsers = require("./seedUsers");
const seedGroups = require("./seedGroups");

(async () => {
	try {
		await mongodbConnect();

		// await seedUsers();
		// await seedGroups();


	} catch (e) {
		console.error(e);
	}
})();