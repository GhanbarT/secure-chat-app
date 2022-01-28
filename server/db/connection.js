const mongoose = require("mongoose");

const mongodbConnect = async () => {
	try {
		console.log("connecting to mongodb ...");
		await mongoose.connect(process.env.MONGODB_CONNECTION_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log("mongodb connected");
	} catch (e) {
		console.log(e);
		throw new Error("Could not connect to database!");
	}
};


module.exports = {
	mongodbConnect
}