const {Users} = require("../models");

const seedUsers = async () => {
	try {
		await Users.create([
			{
				username: "ghanbar",
				password: "$2b$10$9Dy85zGu02E7RB7BSMlLxuWcmF9TisjijKj1HftFEplIeDoQjvPMG"
			},
			{
				username: "mammad",
				password: "$2b$10$9Dy85zGu02E7RB7BSMlLxuWcmF9TisjijKj1HftFEplIeDoQjvPMG"
			}
		]);

	} catch (e) {
		console.log(e)
	}
}

module.exports = seedUsers