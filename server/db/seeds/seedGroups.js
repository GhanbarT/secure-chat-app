const {Groups} = require("../models");
const {} = require("mongoose");


const seedGroups = async () => {
	try {
		console.log('seeding groups');
		await Groups.create([
			{
				groupName: "iut",
				blpUsers: [
					"61f4550131ae92d884d96844"
				],
				bibaUsers: [
					"61f4550131ae92d884d96845"
				]
			}
		]);
		console.log("Done")
	} catch (e) {
		console.log(e)
	}
}

module.exports = seedGroups;